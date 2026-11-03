import { useRef, type KeyboardEvent } from 'react';
import { RINGS } from '../data/model';
import { useLocale } from '../i18n/LocaleContext';
import { GEOMETRY, type PlacedBlip } from '../radar/layout';
import { BlipMarker, isTriangle } from './BlipMarker';

interface Props {
  blips: PlacedBlip[];
  matches: ReadonlySet<string>;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onClear: () => void;
}

const { size, center, radius, ringEdges, blipRadius, collisionRadius } = GEOMETRY;

// Ring names sit on the horizontal axis, in the middle of each band.
const RING_LABELS = RINGS.map((ring, i) => ({
  ring,
  r: ((ringEdges[i] + ringEdges[i + 1]) / 2) * radius,
  outer: ringEdges[i + 1] * radius,
}));

function numberOffset(blip: PlacedBlip): string {
  if (blip.entry.movement === 'moved-in') return '0.55em';
  if (blip.entry.movement === 'moved-out') return '0.2em';
  return '0.35em';
}

export default function RadarChart({ blips, matches, selectedId, hoveredId, onSelect, onHover, onClear }: Props) {
  const { t } = useLocale();
  const refs = useRef<Array<SVGGElement | null>>([]);
  const selectedIndex = blips.findIndex((b) => b.entry.id === selectedId);
  const tabStop = selectedIndex >= 0 ? selectedIndex : 0;
  const hovered = blips.find((b) => b.entry.id === hoveredId);

  const focusBlip = (index: number) => {
    const count = blips.length;
    refs.current[(index + count) % count]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<SVGGElement>, index: number, id: string) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        focusBlip(index + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        focusBlip(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusBlip(0);
        break;
      case 'End':
        event.preventDefault();
        focusBlip(blips.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect(id);
        break;
      case 'Escape':
        onClear();
        break;
      default:
        break;
    }
  };

  return (
    <div className="radar-canvas">
      <svg
        className="radar-svg"
        viewBox={`0 0 ${size} ${size}`}
        role="group"
        aria-label={t.chart.label(blips.length)}
      >
        <g aria-hidden="true">
          {[...RING_LABELS].reverse().map(({ ring, outer }) => (
            <circle key={ring.id} className={`band band-${ring.id}`} cx={center} cy={center} r={outer} />
          ))}
          <circle className="band-edge" cx={center} cy={center} r={radius} />
          <line className="axis" x1={center} y1={center - radius} x2={center} y2={center + radius} />
          <line className="axis" x1={center - radius} y1={center} x2={center + radius} y2={center} />
          {RING_LABELS.flatMap(({ ring, r }) =>
            [-1, 1].map((side) => (
              <text
                key={`${ring.id}${side}`}
                className={`ring-label ring-text-${ring.id}`}
                x={center + side * r}
                y={center}
                dy="0.35em"
                textAnchor="middle"
              >
                {t.rings[ring.id].name.toUpperCase()}
              </text>
            )),
          )}
        </g>
        <g className="blips">
          {blips.map((blip, index) => {
            const { entry } = blip;
            const selected = entry.id === selectedId;
            const dimmed = !matches.has(entry.id);
            const classes = ['blip', selected && 'is-selected', dimmed && 'is-dimmed', entry.id === hoveredId && 'is-hovered']
              .filter(Boolean)
              .join(' ');
            return (
              <g
                key={entry.id}
                ref={(element) => {
                  refs.current[index] = element;
                }}
                className={classes}
                transform={`translate(${blip.x} ${blip.y})`}
                role="button"
                tabIndex={index === tabStop ? 0 : -1}
                aria-label={`${blip.number}. ${entry.name}, ${t.rings[entry.ring].name}, ${t.quadrants[entry.quadrant]}`}
                aria-pressed={selected}
                data-testid="blip"
                data-id={entry.id}
                data-dimmed={dimmed ? 'true' : 'false'}
                onClick={() => onSelect(entry.id)}
                onMouseEnter={() => onHover(entry.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(entry.id)}
                onBlur={() => onHover(null)}
                onKeyDown={(event) => handleKeyDown(event, index, entry.id)}
              >
                <circle className="blip-hit" r={collisionRadius} />
                {selected && <circle className="blip-pulse" r={blipRadius + 7} />}
                <circle className="blip-focus" r={blipRadius + 6} />
                <BlipMarker movement={entry.movement} ring={entry.ring} r={blipRadius} />
                <text
                  className={`blip-num${isTriangle(entry.movement) ? ' is-small' : ''}`}
                  dy={numberOffset(blip)}
                  textAnchor="middle"
                  aria-hidden="true"
                >
                  {blip.number}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      {hovered && (
        <div
          className="radar-tip"
          // Clamped so the label never spills outside the radar near its edges.
          style={{ left: `${Math.min(Math.max((hovered.x / size) * 100, 14), 86)}%`, top: `${(hovered.y / size) * 100}%` }}
          aria-hidden="true"
        >
          <span className={`tip-num ring-bg-${hovered.entry.ring}`}>{hovered.number}</span>
          {hovered.entry.name}
        </div>
      )}
    </div>
  );
}
