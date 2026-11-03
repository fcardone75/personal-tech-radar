import { RINGS, type QUADRANTS } from '../data/model';
import { pad2 } from '../radar/filters';
import type { PlacedBlip } from '../radar/layout';
import { MarkerIcon } from './BlipMarker';

interface Props {
  quadrant: (typeof QUADRANTS)[number];
  index: number;
  blips: PlacedBlip[];
  matches: ReadonlySet<string>;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

export default function QuadrantLegend({ quadrant, index, blips, matches, selectedId, hoveredId, onSelect, onHover }: Props) {
  const items = blips.filter((b) => b.entry.quadrant === quadrant.id);
  const headingId = `legend-${quadrant.id}`;

  return (
    <section className="legend" aria-labelledby={headingId}>
      <header className="legend-head">
        <h3 id={headingId}>
          <span className="legend-index">{pad2(index + 1)}</span>
          {quadrant.name}
        </h3>
        <span className="legend-total">{items.length}</span>
      </header>
      {RINGS.map((ring) => {
        const group = items.filter((b) => b.entry.ring === ring.id);
        if (group.length === 0) return null;
        return (
          <div className="legend-group" key={ring.id}>
            <p className="legend-ring">
              <span className={`dot ring-bg-${ring.id}`} aria-hidden="true" />
              {ring.name}
              <span className="legend-ring-count">{group.length}</span>
            </p>
            <ul className="legend-list">
              {group.map(({ entry, number }) => {
                const classes = [
                  'legend-item',
                  entry.id === selectedId && 'is-selected',
                  entry.id === hoveredId && 'is-hovered',
                  !matches.has(entry.id) && 'is-dimmed',
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      className={classes}
                      aria-pressed={entry.id === selectedId}
                      data-testid="legend-item"
                      onClick={() => onSelect(entry.id)}
                      onMouseEnter={() => onHover(entry.id)}
                      onMouseLeave={() => onHover(null)}
                      onFocus={() => onHover(entry.id)}
                      onBlur={() => onHover(null)}
                    >
                      <span className={`legend-num ring-bg-${entry.ring}`}>{number}</span>
                      <span className="legend-name">{entry.name}</span>
                      {entry.movement !== 'none' && <MarkerIcon movement={entry.movement} ring={entry.ring} size={14} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
