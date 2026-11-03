import { quadrantIndex, ringIndex, type QuadrantId, type RadarEntry, type RingId } from '../data/model';

// Deterministic blip placement.
// Every blip gets a seeded pseudo-random start inside its quadrant (a 90° sector)
// and ring (a radial band), derived from its id, so positions are stable across
// reloads. A few relaxation passes then push blips apart until they keep a
// minimum distance, without ever leaving their cell or touching the axes.

export const GEOMETRY = {
  size: 800,
  center: 400,
  radius: 384,
  // Ring edges as a fraction of the radius: adopt | trial | assess | hold.
  ringEdges: [0, 0.5, 0.72, 0.87, 1],
  innerHole: 0.12,
  blipRadius: 11,
  collisionRadius: 14,
  gap: 3,
  axisMargin: 6,
  ringMargin: 3,
} as const;

// Sign of x and y (y pointing up) for each quadrant.
export const QUADRANT_SIGNS: Record<QuadrantId, readonly [number, number]> = {
  techniques: [-1, 1], // top left
  platforms: [1, 1], // top right
  languages: [-1, -1], // bottom left
  'data-ai': [1, -1], // bottom right
};

export interface PlacedBlip {
  entry: RadarEntry;
  /** 1-based, follows the legend order: quadrant, then ring, then data order. */
  number: number;
  /** SVG user units, origin top left, y pointing down. */
  x: number;
  y: number;
}

interface Point {
  x: number; // relative to the centre
  y: number; // relative to the centre, pointing up
}

interface Cell {
  sx: number;
  sy: number;
  rMin: number;
  rMax: number;
  clearance: number;
}

export const minDistance = (): number => 2 * GEOMETRY.collisionRadius + GEOMETRY.gap;
export const axisClearance = (): number => GEOMETRY.collisionRadius + GEOMETRY.axisMargin;

/** Allowed distance from the centre for a blip centre in the given ring. */
export function bandFor(ring: RingId): { rMin: number; rMax: number } {
  const i = ringIndex(ring);
  const { radius, ringEdges, innerHole, collisionRadius, ringMargin } = GEOMETRY;
  const inner = (i === 0 ? innerHole : ringEdges[i]) * radius;
  return {
    rMin: inner + collisionRadius + ringMargin,
    rMax: ringEdges[i + 1] * radius - collisionRadius - ringMargin,
  };
}

/** Legend order: quadrant, ring, then the order of the data file. */
export function orderEntries(entries: readonly RadarEntry[]): RadarEntry[] {
  return entries
    .map((entry, index) => ({ entry, index }))
    .sort(
      (a, b) =>
        quadrantIndex(a.entry.quadrant) - quadrantIndex(b.entry.quadrant) ||
        ringIndex(a.entry.ring) - ringIndex(b.entry.ring) ||
        a.index - b.index,
    )
    .map(({ entry }) => entry);
}

/** FNV-1a, 32 bit. */
export function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Small seeded PRNG returning numbers in [0, 1). */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clampToCell(p: Point, cell: Cell): void {
  // Work in the cell's local frame, where both coordinates are positive.
  const lx = Math.max(cell.sx * p.x, 1e-6);
  const ly = Math.max(cell.sy * p.y, 1e-6);
  const r = Math.min(Math.max(Math.hypot(lx, ly), cell.rMin), cell.rMax);
  // Keep the centre at least `clearance` away from both axes.
  const minAngle = Math.asin(Math.min(cell.clearance / r, 1));
  const maxAngle = Math.PI / 2 - minAngle;
  const angle = Math.min(Math.max(Math.atan2(ly, lx), minAngle), maxAngle);
  p.x = cell.sx * r * Math.cos(angle);
  p.y = cell.sy * r * Math.sin(angle);
}

function initialPoint(id: string, attempt: number, cell: Cell): Point {
  const random = mulberry32(hashString(`${id}#${attempt}`));
  const angle = (0.1 + 0.8 * random()) * (Math.PI / 2);
  const r = Math.sqrt(cell.rMin ** 2 + random() * (cell.rMax ** 2 - cell.rMin ** 2));
  const p = { x: cell.sx * r * Math.cos(angle), y: cell.sy * r * Math.sin(angle) };
  clampToCell(p, cell);
  return p;
}

function minPairDistance(points: Point[]): number {
  let min = Infinity;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      min = Math.min(min, Math.hypot(points[j].x - points[i].x, points[j].y - points[i].y));
    }
  }
  return min;
}

function relax(points: Point[], cell: Cell, target: number): void {
  for (let iteration = 0; iteration < 400; iteration++) {
    let worst = 0;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i];
        const b = points[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let d = Math.hypot(dx, dy);
        if (d >= target) continue;
        if (d < 1e-6) {
          // Identical points: separate them along a fixed, index-based direction.
          const angle = i * 2.399963 + j;
          dx = Math.cos(angle);
          dy = Math.sin(angle);
          d = 0;
        } else {
          dx /= d;
          dy /= d;
        }
        const push = (target - d) * 0.28;
        a.x -= dx * push;
        a.y -= dy * push;
        b.x += dx * push;
        b.y += dy * push;
        worst = Math.max(worst, target - d);
      }
    }
    points.forEach((p) => clampToCell(p, cell));
    if (worst < 0.05) return;
  }
}

function placeCell(entries: RadarEntry[], quadrant: QuadrantId, ring: RingId): Point[] {
  const [sx, sy] = QUADRANT_SIGNS[quadrant];
  const cell: Cell = { sx, sy, ...bandFor(ring), clearance: axisClearance() };
  const minDist = minDistance();
  // Aim for an even spread: the spacing the cell could give each blip, capped.
  const area = (Math.PI / 4) * (cell.rMax ** 2 - cell.rMin ** 2);
  const ideal = Math.sqrt(area / Math.max(entries.length, 1)) * 0.92;
  const preferred = Math.min(Math.max(ideal, minDist), minDist * 2.5);

  let best: Point[] = [];
  let bestDistance = -1;
  for (let attempt = 0; attempt < 8; attempt++) {
    const target = Math.max(minDist, preferred * (1 - attempt * 0.05));
    const points = entries.map((e) => initialPoint(e.id, attempt, cell));
    relax(points, cell, target);
    const distance = entries.length < 2 ? Infinity : minPairDistance(points);
    if (distance >= minDist - 1e-6) return points;
    if (distance > bestDistance) {
      best = points;
      bestDistance = distance;
    }
  }
  // Too many blips for one cell. The unit tests fail in this case.
  return best;
}

const round = (value: number) => Math.round(value * 100) / 100;

export function layoutRadar(entries: readonly RadarEntry[]): PlacedBlip[] {
  const ordered = orderEntries(entries);
  const cells = new Map<string, { quadrant: QuadrantId; ring: RingId; entries: RadarEntry[] }>();
  for (const entry of ordered) {
    const key = `${entry.quadrant}|${entry.ring}`;
    const cell = cells.get(key) ?? { quadrant: entry.quadrant, ring: entry.ring, entries: [] };
    cell.entries.push(entry);
    cells.set(key, cell);
  }

  const positions = new Map<string, Point>();
  for (const cell of cells.values()) {
    placeCell(cell.entries, cell.quadrant, cell.ring).forEach((point, i) => positions.set(cell.entries[i].id, point));
  }

  const { center } = GEOMETRY;
  return ordered.map((entry, i) => {
    const p = positions.get(entry.id) ?? { x: 0, y: 0 };
    return { entry, number: i + 1, x: round(center + p.x), y: round(center - p.y) };
  });
}
