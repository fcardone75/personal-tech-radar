import { projectsById } from '../data';
import { RINGS, type QuadrantId, type RadarEntry, type RingId } from '../data/model';
import type { Locale } from '../i18n/locale';
import type { PlacedBlip } from './layout';

export interface Filters {
  query: string;
  quadrant: QuadrantId | 'all';
  ring: RingId | 'all';
}

export const NO_FILTERS: Filters = { query: '', quadrant: 'all', ring: 'all' };

export const isFiltered = (filters: Filters): boolean =>
  filters.query.trim() !== '' || filters.quadrant !== 'all' || filters.ring !== 'all';

/** Search runs on the text shown in the current language. */
export function matchesFilters(entry: RadarEntry, filters: Filters, { t, why }: Pick<Locale, 't' | 'why'>): boolean {
  if (filters.quadrant !== 'all' && entry.quadrant !== filters.quadrant) return false;
  if (filters.ring !== 'all' && entry.ring !== filters.ring) return false;
  const query = filters.query.trim().toLowerCase();
  if (!query) return true;
  const haystack = [
    entry.name,
    why(entry),
    t.quadrants[entry.quadrant],
    t.rings[entry.ring].name,
    ...entry.usedIn.map((id) => projectsById.get(id)?.title ?? ''),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

export function ringCounts(blips: readonly PlacedBlip[]): Record<RingId, number> {
  const counts = Object.fromEntries(RINGS.map((r) => [r.id, 0])) as Record<RingId, number>;
  for (const blip of blips) counts[blip.entry.ring] += 1;
  return counts;
}

export const pad2 = (value: number): string => String(value).padStart(2, '0');
