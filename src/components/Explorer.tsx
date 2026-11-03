import { QUADRANTS, RINGS, quadrantOf, ringOf, type QuadrantId } from '../data/model';
import { NO_FILTERS, isFiltered, pad2, ringCounts, type Filters } from '../radar/filters';
import type { PlacedBlip } from '../radar/layout';
import Controls, { type View } from './Controls';
import DetailPanel from './DetailPanel';
import ListView from './ListView';
import QuadrantLegend from './QuadrantLegend';
import RadarChart from './RadarChart';

interface Props {
  blips: PlacedBlip[];
  matches: ReadonlySet<string>;
  filters: Filters;
  onFilters: (filters: Filters) => void;
  view: View;
  onView: (view: View) => void;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  compact: boolean;
}

interface QuadrantButtonProps {
  quadrant: (typeof QUADRANTS)[number];
  index: number;
  count: number;
  active: boolean;
  align: 'start' | 'end';
  onToggle: () => void;
}

function QuadrantButton({ quadrant, index, count, active, align, onToggle }: QuadrantButtonProps) {
  return (
    <button type="button" className={`quad-label align-${align}`} aria-pressed={active} onClick={onToggle}>
      <span className="quad-label-index">{pad2(index + 1)}</span>
      <span className="quad-label-name">{quadrant.name}</span>
      <span className="quad-label-count">{count} entries</span>
    </button>
  );
}

function emptyMessage(filters: Filters): string {
  const parts: string[] = [];
  if (filters.ring !== 'all') parts.push(ringOf(filters.ring).name);
  if (filters.quadrant !== 'all') parts.push(quadrantOf(filters.quadrant).name);
  const scope = parts.length > 0 ? ` in ${parts.join(' · ')}` : '';
  const query = filters.query.trim();
  return query ? `No technologies match “${query}”${scope}.` : `No technologies${scope}.`;
}

export default function Explorer(props: Props) {
  const { blips, matches, filters, onFilters, view, onView, selectedId, hoveredId, onSelect, onHover, compact } = props;
  const selectedIndex = blips.findIndex((b) => b.entry.id === selectedId);
  const selected = selectedIndex >= 0 ? blips[selectedIndex] : null;
  const counts = ringCounts(blips);
  const total = blips.length;
  const filtered = isFiltered(filters);

  const step = (delta: number) => {
    const start = selectedIndex < 0 ? 0 : selectedIndex;
    onSelect(blips[(start + delta + total) % total].entry.id);
  };

  const toggleQuadrant = (id: QuadrantId) => onFilters({ ...filters, quadrant: filters.quadrant === id ? 'all' : id });

  const quadrantButton = (index: number, align: 'start' | 'end') => {
    const quadrant = QUADRANTS[index];
    return (
      <QuadrantButton
        quadrant={quadrant}
        index={index}
        count={blips.filter((b) => b.entry.quadrant === quadrant.id).length}
        active={filters.quadrant === quadrant.id}
        align={align}
        onToggle={() => toggleQuadrant(quadrant.id)}
      />
    );
  };

  return (
    <section id="radar" className="section explorer-section" aria-labelledby="radar-title">
      <div className="container">
        <header className="section-head">
          <p className="section-index">01 / Explore</p>
          <h2 id="radar-title">
            The radar<span className="accent">.</span>
          </h2>
          <p className="section-lead">
            Four quadrants, four rings. Distance from the centre is my recommendation. Select a blip or a name to see why
            it sits where it does.
          </p>
        </header>

        <Controls view={view} onView={onView} filters={filters} onFilters={onFilters} counts={counts} total={total} />

        <div className="result-line">
          <p aria-live="polite">
            Showing <strong>{matches.size}</strong> of {total}
            {filtered ? ' · filtered entries are dimmed' : ''}
          </p>
          {filtered && (
            <button type="button" className="link-button" onClick={() => onFilters(NO_FILTERS)}>
              Clear filters
            </button>
          )}
        </div>
        {matches.size === 0 && (
          <p className="empty" role="status">
            {emptyMessage(filters)}{' '}
            <button type="button" className="link-button" onClick={() => onFilters(NO_FILTERS)}>
              Clear filters
            </button>
          </p>
        )}

        <div className={`explorer${view === 'list' ? ' is-list' : ''}`}>
          <div className="explorer-main">
            {view === 'radar' ? (
              <>
                <div className="radar-figure">
                  <div className="quad-row">
                    {quadrantButton(0, 'start')}
                    {quadrantButton(1, 'end')}
                  </div>
                  <RadarChart
                    blips={blips}
                    matches={matches}
                    selectedId={selectedId}
                    hoveredId={hoveredId}
                    onSelect={onSelect}
                    onHover={onHover}
                    onClear={() => onSelect(null)}
                  />
                  <div className="quad-row is-bottom">
                    {quadrantButton(2, 'start')}
                    {quadrantButton(3, 'end')}
                  </div>
                  <ul className="radar-ring-key" aria-label="Rings, from the centre outwards">
                    {RINGS.map((ring) => (
                      <li key={ring.id}>
                        <span className={`dot ring-bg-${ring.id}`} aria-hidden="true" />
                        {ring.name}
                      </li>
                    ))}
                    <li className="radar-ring-key-note">Rings from the centre outwards. Numbers are in the lists below.</li>
                  </ul>
                </div>
                <div className="legends">
                  {QUADRANTS.map((quadrant, index) => (
                    <QuadrantLegend
                      key={quadrant.id}
                      quadrant={quadrant}
                      index={index}
                      blips={blips}
                      matches={matches}
                      selectedId={selectedId}
                      hoveredId={hoveredId}
                      onSelect={onSelect}
                      onHover={onHover}
                    />
                  ))}
                </div>
              </>
            ) : (
              <ListView blips={blips} matches={matches} selectedId={selectedId} onSelect={onSelect} />
            )}
          </div>
          <DetailPanel
            blip={selected}
            total={total}
            counts={counts}
            sheet={compact && selected !== null}
            onClose={() => onSelect(null)}
            onStep={step}
          />
        </div>
      </div>
    </section>
  );
}
