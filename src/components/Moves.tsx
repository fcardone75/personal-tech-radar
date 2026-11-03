import { MOVEMENTS, ringOf } from '../data/model';
import type { PlacedBlip } from '../radar/layout';
import { MarkerIcon } from './BlipMarker';
import MovementKey from './MovementKey';

interface Props {
  blips: PlacedBlip[];
  edition: string;
  onSelect: (id: string) => void;
}

export default function Moves({ blips, edition, onSelect }: Props) {
  const moved = blips.filter((b) => b.entry.movement !== 'none');

  return (
    <section id="moves" className="section moves" aria-labelledby="moves-title">
      <div className="container">
        <header className="section-head">
          <p className="section-index">02 / Moves</p>
          <h2 id="moves-title">
            Moves this edition<span className="accent">.</span>
          </h2>
        </header>

        {moved.length === 0 ? (
          <div className="moves-baseline">
            <p>
              Edition {edition} is the baseline: every entry starts here, so nothing has moved yet. From the next edition,
              this section lists what is new and what moved, and why.
            </p>
            <MovementKey />
          </div>
        ) : (
          MOVEMENTS.filter((m) => m.id !== 'none').map((movement) => {
            const group = moved.filter((b) => b.entry.movement === movement.id);
            if (group.length === 0) return null;
            return (
              <div key={movement.id} className="moves-group">
                <h3 className="moves-group-title">
                  <MarkerIcon movement={movement.id} size={18} />
                  {movement.name}
                  <span>{group.length}</span>
                </h3>
                <ul className="moves-grid">
                  {group.map(({ entry, number }) => (
                    <li key={entry.id}>
                      <button type="button" className="move-card" onClick={() => onSelect(entry.id)}>
                        <span className="move-card-head">
                          <span className={`legend-num ring-bg-${entry.ring}`}>{number}</span>
                          <strong>{entry.name}</strong>
                        </span>
                        <span className={`ring-pill ring-${entry.ring}`}>{ringOf(entry.ring).name}</span>
                        <span className="move-card-why">{entry.why}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
