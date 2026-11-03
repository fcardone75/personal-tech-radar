// Radar vocabulary. Order matters: it drives positions on the radar,
// numbering, legends and sorting.

// Display names live in src/i18n/strings.ts, per language.
export const QUADRANTS = [{ id: 'techniques' }, { id: 'platforms' }, { id: 'languages' }, { id: 'data-ai' }] as const;

export const RINGS = [{ id: 'adopt' }, { id: 'trial' }, { id: 'assess' }, { id: 'hold' }] as const;

export const MOVEMENTS = [{ id: 'none' }, { id: 'new' }, { id: 'moved-in' }, { id: 'moved-out' }] as const;

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

/** Italian copy for the data, keyed by entry and project id (radar.it.json). */
export interface DataTranslation {
  entries: Record<string, string>;
  projects: Record<string, { description: string; years?: string }>;
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
