import { describe, expect, it } from 'vitest';
import projects from '../../src/data/projects.json';
import radarIt from '../../src/data/radar.it.json';
import radar from '../../src/data/radar.json';
import { validateRadarData, validateTranslation } from '../../src/data/validate';
import { localize } from '../../src/i18n/locale';

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

describe('Italian translation', () => {
  it('covers every entry and project', () => {
    expect(validateTranslation(radarIt, radar, projects)).toEqual([]);
  });

  it('reports a missing entry and an unknown one', () => {
    const entries: Record<string, string> = { ...radarIt.entries, ghost: 'Non esiste.' };
    delete entries[radar.entries[0].id];
    const errors = validateTranslation({ ...radarIt, entries }, radar, projects).join('\n');
    expect(errors).toMatch(new RegExp(`"${radar.entries[0].id}": missing`));
    expect(errors).toMatch(/"ghost": no such entry/);
  });

  it('localizes data, and keeps "years: null" null', () => {
    const it = localize('it');
    const entry = radar.entries[0] as Parameters<typeof it.why>[0];
    expect(it.why(entry)).toBe(radarIt.entries[entry.id as keyof typeof radarIt.entries]);
    const undated = projects.find((p) => p.years === null);
    if (undated) expect(it.project(undated).years).toBeNull();
    expect(localize('en').why(entry)).toBe(entry.why);
  });

  it('formats months per language', () => {
    expect(localize('en').month('2026-11')).toBe('Nov 2026');
    expect(localize('it').month('2026-11')).toBe('nov 2026');
  });
});
