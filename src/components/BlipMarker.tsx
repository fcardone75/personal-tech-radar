import type { MovementId, RingId } from '../data/model';

// Movement is shown by shape, ring by position and colour:
// circle = no change, circle with an outer ring = new,
// triangle up = moved in (towards Adopt), triangle down = moved out.

function triangle(size: number, pointsUp: boolean): string {
  const x = size * Math.cos(Math.PI / 6);
  const y = size / 2;
  return pointsUp ? `M0 ${-size}L${x} ${y}L${-x} ${y}Z` : `M0 ${size}L${x} ${-y}L${-x} ${-y}Z`;
}

export const isTriangle = (movement: MovementId): boolean => movement === 'moved-in' || movement === 'moved-out';

interface MarkerProps {
  movement: MovementId;
  ring: RingId;
  r: number;
}

export function BlipMarker({ movement, ring, r }: MarkerProps) {
  return (
    <g className={`marker ring-${ring}`}>
      {isTriangle(movement) ? (
        <path className="marker-shape" d={triangle(r * 1.38, movement === 'moved-in')} />
      ) : (
        <circle className="marker-shape" r={r} />
      )}
      {movement === 'new' && <circle className="marker-halo" r={r + 3.5} />}
    </g>
  );
}

interface MarkerIconProps {
  movement?: MovementId;
  ring?: RingId;
  size?: number;
}

/** Stand-alone marker for keys and legends. Decorative: the text next to it carries the meaning. */
export function MarkerIcon({ movement = 'none', ring = 'adopt', size = 16 }: MarkerIconProps) {
  return (
    <svg className="marker-icon" width={size} height={size} viewBox="-16 -16 32 32" aria-hidden="true" focusable="false">
      <BlipMarker movement={movement} ring={ring} r={9.5} />
    </svg>
  );
}
