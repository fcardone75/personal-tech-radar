import { describe, expect, it } from 'vitest';
import projects from '../../src/data/projects.json';
import radar from '../../src/data/radar.json';
import { validateRadarData } from '../../src/data/validate';

const clone = <T>(value: T): T => structuredClone(value);
const firstEntry = () => clone(radar.entries[0]);

describe('radar data', () => {
  it('matches the schema', () => {
    expect(validateRadarData(radar, projects)).toEqual([]);
  });

  it('keeps pending entries out of the published radar', () => {
    const published = new Set(radar.entries.map((e) => e.id));
    for (const pending of radar.pending) expect(published.has(pending.id)).toBe(false);
  });

  it('only references projects that exist', () => {
    const known = new Set(projects.map((p) => p.id));
    for (const entry of radar.entries) for (const id of entry.usedIn) expect(known.has(id)).toBe(true);
  });
});

describe('validateRadarData', () => {
  it('rejects an unknown ring', () => {
    const entry = { ...firstEntry(), ring: 'maybe' };
    const errors = validateRadarData({ ...radar, entries: [entry] }, projects);
    expect(errors.join('\n')).toMatch(/ring/);
  });

  it('rejects duplicate ids', () => {
    const entry = firstEntry();
    const copy = { ...entry, name: `${entry.name} copy` };
    expect(validateRadarData({ ...radar, entries: [entry, copy] }, projects).join('\n')).toMatch(/duplicate/);
  });

  it('rejects unknown projects in usedIn', () => {
    const entry = { ...firstEntry(), usedIn: ['nowhere'] };
    expect(validateRadarData({ ...radar, entries: [entry] }, projects).join('\n')).toMatch(/unknown project "nowhere"/);
  });

  it('rejects ids that clash with page anchors', () => {
    const entry = { ...firstEntry(), id: 'projects' };
    expect(validateRadarData({ ...radar, entries: [entry] }, projects).join('\n')).toMatch(/reserved/);
  });

  it('rejects malformed dates and editions', () => {
    const entry = { ...firstEntry(), lastReviewed: 'November', edition: '26.11', since: 1850 };
    const errors = validateRadarData({ ...radar, entries: [entry] }, projects).join('\n');
    expect(errors).toMatch(/lastReviewed/);
    expect(errors).toMatch(/edition/);
    expect(errors).toMatch(/since/);
  });

  it('rejects an empty radar', () => {
    expect(validateRadarData({ edition: '2026.11', entries: [] }, projects)).not.toEqual([]);
  });
});
