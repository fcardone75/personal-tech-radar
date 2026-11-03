import { QUADRANTS, RINGS, type QuadrantId, type RingId } from '../data/model';
import { useLocale } from '../i18n/LocaleContext';
import type { Filters } from '../radar/filters';
import { ListIcon, RadarIcon, SearchIcon } from './icons';

export type View = 'radar' | 'list';

interface Props {
  view: View;
  onView: (view: View) => void;
  filters: Filters;
  onFilters: (filters: Filters) => void;
  counts: Record<RingId, number>;
  total: number;
}

export default function Controls({ view, onView, filters, onFilters, counts, total }: Props) {
  const { t } = useLocale();
  return (
    <div className="controls">
      <div className="view-switch" role="group" aria-label={t.controls.view}>
        <button type="button" aria-pressed={view === 'radar'} onClick={() => onView('radar')}>
          <RadarIcon />
          {t.controls.radar}
        </button>
        <button type="button" aria-pressed={view === 'list'} onClick={() => onView('list')}>
          <ListIcon />
          {t.controls.list}
        </button>
      </div>

      <label className="search">
        <span className="sr-only">{t.controls.search}</span>
        <SearchIcon />
        <input
          type="search"
          value={filters.query}
          placeholder={t.controls.searchPlaceholder}
          onChange={(event) => onFilters({ ...filters, query: event.target.value })}
        />
      </label>

      <label className="select">
        <span className="sr-only">{t.controls.quadrant}</span>
        <select
          value={filters.quadrant}
          onChange={(event) => onFilters({ ...filters, quadrant: event.target.value as QuadrantId | 'all' })}
        >
          <option value="all">{t.controls.allQuadrants}</option>
          {QUADRANTS.map((quadrant) => (
            <option key={quadrant.id} value={quadrant.id}>
              {t.quadrants[quadrant.id]}
            </option>
          ))}
        </select>
      </label>

      <div className="ring-chips" role="group" aria-label={t.controls.ringFilter}>
        <button
          type="button"
          className="ring-chip"
          aria-pressed={filters.ring === 'all'}
          onClick={() => onFilters({ ...filters, ring: 'all' })}
        >
          {t.controls.all}
          <span className="ring-chip-count">{total}</span>
        </button>
        {RINGS.map((ring) => (
          <button
            key={ring.id}
            type="button"
            className="ring-chip"
            aria-pressed={filters.ring === ring.id}
            onClick={() => onFilters({ ...filters, ring: filters.ring === ring.id ? 'all' : ring.id })}
          >
            <span className={`dot ring-bg-${ring.id}`} aria-hidden="true" />
            {t.rings[ring.id].name}
            <span className="ring-chip-count">{counts[ring.id]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
