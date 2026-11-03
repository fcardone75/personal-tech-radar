import { useEffect, useRef, type KeyboardEvent } from 'react';
import { projectsById } from '../data';
import { RINGS, movementOf, quadrantOf, ringOf, type RingId } from '../data/model';
import type { PlacedBlip } from '../radar/layout';
import { MarkerIcon } from './BlipMarker';
import { ChevronLeft, ChevronRight, Close } from './icons';
import MovementKey from './MovementKey';

interface Props {
  blip: PlacedBlip | null;
  total: number;
  counts: Record<RingId, number>;
  /** On small screens the selected entry opens as a bottom sheet. */
  sheet: boolean;
  onClose: () => void;
  onStep: (delta: number) => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatMonth(value: string): string {
  const [year, month] = value.split('-').map(Number);
  return month ? `${MONTHS[month - 1]} ${year}` : value;
}

function HowToRead({ counts }: { counts: Record<RingId, number> }) {
  return (
    <>
      <p className="detail-kicker">Radar key</p>
      <h3 className="detail-title is-key">How to read the rings</h3>
      <p className="detail-lead">The ring is my recommendation, not my proficiency. Closer to the centre means I trust it more.</p>
      <ol className="ring-key">
        {RINGS.map((ring) => (
          <li key={ring.id} className="ring-key-item">
            <span className={`ring-key-swatch ring-bg-${ring.id}`} aria-hidden="true" />
            <span className="ring-key-text">
              <strong>{ring.name}</strong>
              <span>{ring.help}</span>
              <small>{ring.description}</small>
            </span>
            <span className="ring-key-count" aria-label={`${counts[ring.id]} entries`}>
              {counts[ring.id]}
            </span>
          </li>
        ))}
      </ol>
      <p className="detail-subhead">Shape shows movement since the last edition</p>
      <MovementKey />
      <p className="detail-hint">Select a blip, or a name in the lists, to see why it sits where it does.</p>
    </>
  );
}

export default function DetailPanel({ blip, total, counts, sheet, onClose, onStep }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const open = blip !== null;

  // Move focus into the bottom sheet when it opens, and lock the page behind it.
  useEffect(() => {
    if (!sheet || !open) return undefined;
    panelRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [sheet, open, blip]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && open) onClose();
  };

  if (!blip) {
    return (
      <aside className="detail" data-testid="detail-panel" aria-label="How to read the radar">
        <HowToRead counts={counts} />
      </aside>
    );
  }

  const { entry, number } = blip;
  const ring = ringOf(entry.ring);
  const movement = movementOf(entry.movement);
  const usedIn = entry.usedIn.map((id) => projectsById.get(id)).filter((p) => p !== undefined);

  return (
    <>
      {sheet && <div className="sheet-backdrop" onClick={onClose} aria-hidden="true" />}
      <div
        ref={panelRef}
        className={`detail is-entry${sheet ? ' is-sheet' : ''}`}
        data-testid="detail-panel"
        role={sheet ? 'dialog' : 'region'}
        aria-modal={sheet ? true : undefined}
        aria-labelledby="detail-title"
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        <div className="detail-top">
          <p className="detail-kicker">
            <span className="detail-number">
              {number} / {total}
            </span>
            {quadrantOf(entry.quadrant).name}
          </p>
          <div className="detail-actions">
            <button type="button" className="icon-button" onClick={() => onStep(-1)} aria-label="Previous entry">
              <ChevronLeft />
            </button>
            <button type="button" className="icon-button" onClick={() => onStep(1)} aria-label="Next entry">
              <ChevronRight />
            </button>
            <button type="button" className="icon-button" onClick={onClose} aria-label="Close and show the radar key">
              <Close />
            </button>
          </div>
        </div>

        <h3 id="detail-title" className="detail-title">
          {entry.name}
        </h3>

        <div className="detail-badges">
          <span className={`badge badge-ring ring-${entry.ring}`}>
            <span className={`dot ring-bg-${entry.ring}`} aria-hidden="true" />
            {ring.name}
          </span>
          <span className="badge">
            <MarkerIcon movement={entry.movement} ring={entry.ring} size={14} />
            {movement.name}
          </span>
        </div>
        <p className="detail-ring-help">
          {ring.help}. {ring.description}
        </p>

        <section className="detail-block" aria-labelledby="detail-why">
          <h4 id="detail-why">Why</h4>
          <p className="detail-why">{entry.why}</p>
        </section>

        <dl className="detail-facts">
          <div>
            <dt>Since</dt>
            <dd>{entry.since ?? '—'}</dd>
          </div>
          <div>
            <dt>Last reviewed</dt>
            <dd>{formatMonth(entry.lastReviewed)}</dd>
          </div>
          <div>
            <dt>Edition</dt>
            <dd>{entry.edition}</dd>
          </div>
        </dl>

        <section className="detail-block" aria-labelledby="detail-used">
          <h4 id="detail-used">Used in</h4>
          {usedIn.length > 0 ? (
            <ul className="chip-list">
              {usedIn.map((project) => (
                <li key={project.id}>
                  <a className="chip" href={`#project-${project.id}`} onClick={sheet ? onClose : undefined}>
                    {project.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="detail-muted">Not tied to one of the listed projects.</p>
          )}
        </section>

        <p className="detail-note">The ring is my recommendation, not my proficiency.</p>
      </div>
    </>
  );
}
