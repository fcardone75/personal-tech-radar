import { MOVEMENTS, QUADRANTS, RESERVED_IDS, RINGS } from './model';

// Schema check for the radar content. It runs at build time (see vite.config.ts)
// and in the unit tests: invalid data fails the build.

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EDITION = /^\d{4}\.(0[1-9]|1[0-2])$/;
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const MAX_WHY = 140;

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isText = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

export function validateRadarData(radar: unknown, projects: unknown, now: Date = new Date()): string[] {
  const errors: string[] = [];
  const projectIds = new Set<string>();

  if (!Array.isArray(projects)) {
    errors.push('projects: must be an array');
  } else {
    projects.forEach((p: unknown, i) => {
      const at = `projects[${i}]`;
      if (!isObj(p)) {
        errors.push(`${at}: must be an object`);
        return;
      }
      if (!isText(p.id) || !ID.test(p.id)) errors.push(`${at}.id: must be kebab-case`);
      else if (projectIds.has(p.id)) errors.push(`${at}.id: duplicate "${p.id}"`);
      else projectIds.add(p.id);
      if (!isText(p.title)) errors.push(`${at}.title: required`);
      if (!isText(p.description)) errors.push(`${at}.description: required`);
      if (p.years !== null && !isText(p.years)) errors.push(`${at}.years: text or null`);
    });
  }

  if (!isObj(radar)) return [...errors, 'radar: must be an object'];
  if (!isText(radar.edition) || !EDITION.test(radar.edition)) errors.push('radar.edition: must look like 2026.11');
  if (!Array.isArray(radar.entries) || radar.entries.length === 0) {
    return [...errors, 'radar.entries: must be a non-empty array'];
  }

  const quadrants = new Set<string>(QUADRANTS.map((q) => q.id));
  const rings = new Set<string>(RINGS.map((r) => r.id));
  const movements = new Set<string>(MOVEMENTS.map((m) => m.id));
  const reserved = new Set<string>(RESERVED_IDS);
  const ids = new Set<string>();
  const names = new Set<string>();
  const maxYear = now.getFullYear() + 1;

  radar.entries.forEach((e: unknown, i) => {
    const at = `entries[${i}]`;
    if (!isObj(e)) {
      errors.push(`${at}: must be an object`);
      return;
    }
    const label = isText(e.id) ? `${at} "${e.id}"` : at;

    if (!isText(e.id) || !ID.test(e.id)) errors.push(`${label}.id: must be kebab-case`);
    else if (ids.has(e.id)) errors.push(`${label}.id: duplicate`);
    else if (reserved.has(e.id) || e.id.startsWith('project-')) errors.push(`${label}.id: reserved for a page anchor`);
    else ids.add(e.id);

    if (!isText(e.name)) {
      errors.push(`${label}.name: required`);
    } else {
      const key = e.name.trim().toLowerCase();
      if (names.has(key)) errors.push(`${label}.name: duplicate "${e.name}"`);
      names.add(key);
    }

    if (typeof e.quadrant !== 'string' || !quadrants.has(e.quadrant)) {
      errors.push(`${label}.quadrant: one of ${[...quadrants].join(', ')}`);
    }
    if (typeof e.ring !== 'string' || !rings.has(e.ring)) errors.push(`${label}.ring: one of ${[...rings].join(', ')}`);
    if (typeof e.movement !== 'string' || !movements.has(e.movement)) {
      errors.push(`${label}.movement: one of ${[...movements].join(', ')}`);
    }

    if (!isText(e.why)) errors.push(`${label}.why: required`);
    else if (e.why.length > MAX_WHY) errors.push(`${label}.why: keep it under ${MAX_WHY} characters`);

    const since = e.since;
    if (since !== null && !(typeof since === 'number' && Number.isInteger(since) && since >= 1980 && since <= maxYear)) {
      errors.push(`${label}.since: a year or null`);
    }

    if (!Array.isArray(e.usedIn)) {
      errors.push(`${label}.usedIn: must be an array (it can be empty)`);
    } else {
      const seen = new Set<string>();
      e.usedIn.forEach((p: unknown) => {
        if (typeof p !== 'string' || !projectIds.has(p)) errors.push(`${label}.usedIn: unknown project "${String(p)}"`);
        else if (seen.has(p)) errors.push(`${label}.usedIn: "${p}" listed twice`);
        else seen.add(p);
      });
    }

    if (!isText(e.lastReviewed) || !MONTH.test(e.lastReviewed)) errors.push(`${label}.lastReviewed: must look like 2026-11`);
    if (!isText(e.edition) || !EDITION.test(e.edition)) errors.push(`${label}.edition: must look like 2026.11`);
  });

  if (radar.pending !== undefined) {
    if (!Array.isArray(radar.pending)) {
      errors.push('radar.pending: must be an array');
    } else {
      radar.pending.forEach((p: unknown, i) => {
        const at = `pending[${i}]`;
        if (!isObj(p) || !isText(p.id) || !isText(p.name) || !isText(p.todo)) {
          errors.push(`${at}: needs id, name and todo`);
          return;
        }
        if (ids.has(p.id)) errors.push(`${at}.id: "${p.id}" is also published in entries`);
        if (typeof p.quadrant !== 'string' || !quadrants.has(p.quadrant)) errors.push(`${at}.quadrant: unknown quadrant`);
      });
    }
  }

  return errors;
}

/**
 * The Italian copy (radar.it.json) must cover every published entry and every
 * project, and nothing else, so a new entry cannot ship half translated.
 */
export function validateTranslation(translation: unknown, radar: unknown, projects: unknown): string[] {
  if (!isObj(translation) || !isObj(translation.entries) || !isObj(translation.projects)) {
    return ['translation: needs "entries" and "projects" objects'];
  }
  const errors: string[] = [];
  const entries = isObj(radar) && Array.isArray(radar.entries) ? radar.entries.filter(isObj) : [];
  const entryIds = new Set(entries.map((e) => e.id));
  const projectList = Array.isArray(projects) ? projects.filter(isObj) : [];
  const projectIds = new Set(projectList.map((p) => p.id));

  for (const id of entryIds) {
    const why = translation.entries[String(id)];
    if (!isText(why)) errors.push(`translation.entries "${String(id)}": missing`);
    else if (why.length > MAX_WHY) errors.push(`translation.entries "${String(id)}": keep it under ${MAX_WHY} characters`);
  }
  for (const id of Object.keys(translation.entries)) {
    if (!entryIds.has(id)) errors.push(`translation.entries "${id}": no such entry`);
  }

  for (const project of projectList) {
    const id = String(project.id);
    const text = translation.projects[id];
    if (!isObj(text) || !isText(text.description)) {
      errors.push(`translation.projects "${id}".description: missing`);
      continue;
    }
    if (text.years !== undefined && !isText(text.years)) errors.push(`translation.projects "${id}".years: text`);
  }
  for (const id of Object.keys(translation.projects)) {
    if (!projectIds.has(id)) errors.push(`translation.projects "${id}": no such project`);
  }
  return errors;
}
