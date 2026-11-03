import { QUADRANTS, RINGS, type QuadrantId, type RingId } from '../data/model';
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
  return (
    <div className="controls">
      <div className="view-switch" role="group" aria-label="View">
        <button type="button" aria-pressed={view === 'radar'} onClick={() => onView('radar')}>
          <RadarIcon />
          Radar
        </button>
        <button type="button" aria-pressed={view === 'list'} onClick={() => onView('list')}>
          <ListIcon />
          List
        </button>
      </div>

      <label className="search">
        <span className="sr-only">Search technologies</span>
        <SearchIcon />
        <input
          type="search"
          value={filters.query}
          placeholder="Search names, reasons, projects…"
          onChange={(event) => onFilters({ ...filters, query: event.target.value })}
        />
      </label>

      <label className="select">
        <span className="sr-only">Quadrant</span>
        <select
          value={filters.quadrant}
          onChange={(event) => onFilters({ ...filters, quadrant: event.target.value as QuadrantId | 'all' })}
        >
          <option value="all">All quadrants</option>
          {QUADRANTS.map((quadrant) => (
            <option key={quadrant.id} value={quadrant.id}>
              {quadrant.name}
            </option>
          ))}
        </select>
      </label>

      <div className="ring-chips" role="group" aria-label="Filter by ring">
        <button
          type="button"
          className="ring-chip"
          aria-pressed={filters.ring === 'all'}
          onClick={() => onFilters({ ...filters, ring: 'all' })}
        >
          All
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
            {ring.name}
            <span className="ring-chip-count">{counts[ring.id]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
