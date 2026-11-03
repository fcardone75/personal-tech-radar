import { MOVEMENTS } from '../data/model';
import { useLocale } from '../i18n/LocaleContext';
import type { PlacedBlip } from '../radar/layout';
import { MarkerIcon } from './BlipMarker';
import MovementKey from './MovementKey';

interface Props {
  blips: PlacedBlip[];
  edition: string;
  onSelect: (id: string) => void;
}

export default function Moves({ blips, edition, onSelect }: Props) {
  const { t, why } = useLocale();
  const moved = blips.filter((b) => b.entry.movement !== 'none');

  return (
    <section id="moves" className="section moves" aria-labelledby="moves-title">
      <div className="container">
        <header className="section-head">
          <p className="section-index">{t.moves.index}</p>
          <h2 id="moves-title">
            {t.moves.title}<span className="accent">.</span>
          </h2>
        </header>

        {moved.length === 0 ? (
          <div className="moves-baseline">
            <p>{t.moves.baseline(edition)}</p>
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
                  {t.movements[movement.id]}
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
                        <span className={`ring-pill ring-${entry.ring}`}>{t.rings[entry.ring].name}</span>
                        <span className="move-card-why">{why(entry)}</span>
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
