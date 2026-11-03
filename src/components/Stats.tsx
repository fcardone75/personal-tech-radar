import { QUADRANTS, RINGS } from '../data/model';
import { useLocale } from '../i18n/LocaleContext';
import { pad2, ringCounts } from '../radar/filters';
import type { PlacedBlip } from '../radar/layout';

export default function Stats({ blips }: { blips: PlacedBlip[] }) {
  const { t } = useLocale();
  const counts = ringCounts(blips);
  const summary = RINGS.map((ring) => `${t.rings[ring.id].name} ${counts[ring.id]}`).join(', ');

  return (
    <section className="stats" aria-label={t.stats.label}>
      <div className="container stats-inner">
        <dl className="stats-list">
          <div className="stat">
            <dt>{t.stats.technologies}</dt>
            <dd>{pad2(blips.length)}</dd>
          </div>
          <div className="stat">
            <dt>{t.stats.quadrants}</dt>
            <dd>{pad2(QUADRANTS.length)}</dd>
          </div>
          <div className="stat">
            <dt>{t.stats.rings}</dt>
            <dd>{pad2(RINGS.length)}</dd>
          </div>
        </dl>
        <div className="ring-bar">
          <p className="ring-bar-title">{t.stats.perRing}</p>
          <div className="ring-bar-track" role="img" aria-label={`${t.stats.perRing}: ${summary}`}>
            {RINGS.filter((ring) => counts[ring.id] > 0).map((ring) => (
              <span key={ring.id} className={`ring-bar-seg ring-bg-${ring.id}`} style={{ flexGrow: counts[ring.id] }} />
            ))}
          </div>
          <ul className="ring-bar-legend" aria-hidden="true">
            {RINGS.map((ring) => (
              <li key={ring.id}>
                <span className={`dot ring-bg-${ring.id}`} />
                {t.rings[ring.id].name}
                <strong>{counts[ring.id]}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
