// Radar vocabulary. Order matters: it drives positions on the radar,
// numbering, legends and sorting.

export const QUADRANTS = [
  { id: 'techniques', name: 'Techniques & Architecture' },
  { id: 'platforms', name: 'Platforms & Infrastructure' },
  { id: 'languages', name: 'Languages & Frameworks' },
  { id: 'data-ai', name: 'Data & AI' },
] as const;

export const RINGS = [
  { id: 'adopt', name: 'Adopt', help: 'Confident choice', description: 'My default. I use it in production and recommend it.' },
  { id: 'trial', name: 'Trial', help: 'Experiment in practice', description: 'Used on real work. Still proving its fit.' },
  { id: 'assess', name: 'Assess', help: 'Worth investigating', description: 'Promising. I study it before I bet on it.' },
  { id: 'hold', name: 'Hold', help: 'Use with caution', description: 'I would not start something new with it.' },
] as const;

export const MOVEMENTS = [
  { id: 'none', name: 'No change' },
  { id: 'new', name: 'New' },
  { id: 'moved-in', name: 'Moved in' },
  { id: 'moved-out', name: 'Moved out' },
] as const;

export type QuadrantId = (typeof QUADRANTS)[number]['id'];
export type RingId = (typeof RINGS)[number]['id'];
export type MovementId = (typeof MOVEMENTS)[number]['id'];

export interface RadarEntry {
  id: string;
  name: string;
  quadrant: QuadrantId;
  ring: RingId;
  movement: MovementId;
  why: string;
  since: number | null;
  usedIn: string[];
  lastReviewed: string;
  edition: string;
}

export interface PendingEntry {
  id: string;
  name: string;
  quadrant: QuadrantId;
  todo: string;
}

export interface RadarData {
  edition: string;
  entries: RadarEntry[];
  pending?: PendingEntry[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  years: string | null;
}

// Page anchors. Entry ids live in the URL hash too, so they must not collide.
export const RESERVED_IDS = ['top', 'main', 'radar', 'moves', 'projects', 'principles'] as const;

export const quadrantIndex = (id: QuadrantId) => QUADRANTS.findIndex((q) => q.id === id);
export const ringIndex = (id: RingId) => RINGS.findIndex((r) => r.id === id);
export const quadrantOf = (id: QuadrantId) => QUADRANTS[quadrantIndex(id)];
export const ringOf = (id: RingId) => RINGS[ringIndex(id)];
export const movementOf = (id: MovementId) => MOVEMENTS.find((m) => m.id === id) ?? MOVEMENTS[0];
