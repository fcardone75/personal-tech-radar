import { useEffect, useRef, type KeyboardEvent } from 'react';
import { projectsById } from '../data';
import { RINGS, type RingId } from '../data/model';
import { useLocale } from '../i18n/LocaleContext';
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

function HowToRead({ counts }: { counts: Record<RingId, number> }) {
  const { t } = useLocale();
  return (
    <>
      <p className="detail-kicker">{t.detail.keyKicker}</p>
      <h3 className="detail-title is-key">{t.detail.keyTitle}</h3>
      <p className="detail-lead">{t.detail.keyLead}</p>
      <ol className="ring-key">
        {RINGS.map((ring) => (
          <li key={ring.id} className="ring-key-item">
            <span className={`ring-key-swatch ring-bg-${ring.id}`} aria-hidden="true" />
            <span className="ring-key-text">
              <strong>{t.rings[ring.id].name}</strong>
              <span>{t.rings[ring.id].help}</span>
              <small>{t.rings[ring.id].description}</small>
            </span>
            <span className="ring-key-count" aria-label={t.detail.keyCount(counts[ring.id])}>
              {counts[ring.id]}
            </span>
          </li>
        ))}
      </ol>
      <p className="detail-subhead">{t.detail.shapes}</p>
      <MovementKey />
      <p className="detail-hint">{t.detail.hint}</p>
    </>
  );
}

export default function DetailPanel({ blip, total, counts, sheet, onClose, onStep }: Props) {
  const { t, why, project, month } = useLocale();
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
      <aside className="detail" data-testid="detail-panel" aria-label={t.detail.keyLabel}>
        <HowToRead counts={counts} />
      </aside>
    );
  }

  const { entry, number } = blip;
  const ring = t.rings[entry.ring];
  const usedIn = entry.usedIn.map((id) => projectsById.get(id)).filter((p) => p !== undefined).map(project);

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
            {t.quadrants[entry.quadrant]}
          </p>
          <div className="detail-actions">
            <button type="button" className="icon-button" onClick={() => onStep(-1)} aria-label={t.detail.previous}>
              <ChevronLeft />
            </button>
            <button type="button" className="icon-button" onClick={() => onStep(1)} aria-label={t.detail.next}>
              <ChevronRight />
            </button>
            <button type="button" className="icon-button" onClick={onClose} aria-label={t.detail.close}>
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
            {t.movements[entry.movement]}
          </span>
        </div>
        <p className="detail-ring-help">
          {ring.help}. {ring.description}
        </p>

        <section className="detail-block" aria-labelledby="detail-why">
          <h4 id="detail-why">{t.detail.why}</h4>
          <p className="detail-why">{why(entry)}</p>
        </section>

        <dl className="detail-facts">
          <div>
            <dt>{t.detail.since}</dt>
            <dd>{entry.since ?? '—'}</dd>
          </div>
          <div>
            <dt>{t.detail.lastReviewed}</dt>
            <dd>{month(entry.lastReviewed)}</dd>
          </div>
          <div>
            <dt>{t.detail.edition}</dt>
            <dd>{entry.edition}</dd>
          </div>
        </dl>

        <section className="detail-block" aria-labelledby="detail-used">
          <h4 id="detail-used">{t.detail.usedIn}</h4>
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
            <p className="detail-muted">{t.detail.noProject}</p>
          )}
        </section>

        <p className="detail-note">{t.detail.note}</p>
      </div>
    </>
  );
}
