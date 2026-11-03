import { describe, expect, it } from 'vitest';
import type { QuadrantId, RadarEntry, RingId } from '../../src/data/model';
import radar from '../../src/data/radar.json';
import {
  GEOMETRY,
  QUADRANT_SIGNS,
  axisClearance,
  bandFor,
  layoutRadar,
  minDistance,
  orderEntries,
  type PlacedBlip,
} from '../../src/radar/layout';

const entries = radar.entries as RadarEntry[];
const EPSILON = 0.05;

function local(blip: PlacedBlip) {
  const [sx, sy] = QUADRANT_SIGNS[blip.entry.quadrant];
  const x = blip.x - GEOMETRY.center;
  const y = GEOMETRY.center - blip.y;
  return { lx: sx * x, ly: sy * y, r: Math.hypot(x, y) };
}

function expectValidLayout(blips: PlacedBlip[]) {
  for (const blip of blips) {
    const { lx, ly, r } = local(blip);
    const { rMin, rMax } = bandFor(blip.entry.ring);
    // Inside its quadrant, away from both axes.
    expect(lx, `${blip.entry.id} x`).toBeGreaterThanOrEqual(axisClearance() - EPSILON);
    expect(ly, `${blip.entry.id} y`).toBeGreaterThanOrEqual(axisClearance() - EPSILON);
    // Inside its ring band, away from the ring borders.
    expect(r, `${blip.entry.id} radius`).toBeGreaterThanOrEqual(rMin - EPSILON);
    expect(r, `${blip.entry.id} radius`).toBeLessThanOrEqual(rMax + EPSILON);
  }
  for (let i = 0; i < blips.length; i++) {
    for (let j = i + 1; j < blips.length; j++) {
      const d = Math.hypot(blips[i].x - blips[j].x, blips[i].y - blips[j].y);
      expect(d, `${blips[i].entry.id} vs ${blips[j].entry.id}`).toBeGreaterThanOrEqual(minDistance() - EPSILON);
    }
  }
}

function synthetic(count: number, quadrant: QuadrantId, ring: RingId): RadarEntry[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${quadrant}-${ring}-${i}`,
    name: `Entry ${i}`,
    quadrant,
    ring,
    movement: 'none',
    why: 'Test entry.',
    since: null,
    usedIn: [],
    lastReviewed: '2026-11',
    edition: '2026.11',
  }));
}

describe('layoutRadar', () => {
  const blips = layoutRadar(entries);

  it('places every published entry once', () => {
    expect(blips).toHaveLength(entries.length);
    expect(new Set(blips.map((b) => b.entry.id)).size).toBe(entries.length);
  });

  it('keeps every blip inside its quadrant and ring, with no overlaps', () => {
    expectValidLayout(blips);
  });

  it('is deterministic', () => {
    expect(layoutRadar(structuredClone(entries))).toEqual(blips);
  });

  it('numbers blips in legend order: quadrant, ring, then data order', () => {
    expect(blips.map((b) => b.number)).toEqual(entries.map((_, i) => i + 1));
    expect(blips.map((b) => b.entry.id)).toEqual(orderEntries(entries).map((e) => e.id));
  });

  it('handles a crowded cell', () => {
    expectValidLayout(layoutRadar(synthetic(22, 'platforms', 'adopt')));
    expectValidLayout(layoutRadar(synthetic(8, 'languages', 'hold')));
  });
});
