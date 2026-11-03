import { useState } from 'react';
import { projectsById } from '../data';
import { QUADRANTS, ringIndex } from '../data/model';
import { useLocale } from '../i18n/LocaleContext';
import type { Lang } from '../i18n/locale';
import { pad2 } from '../radar/filters';
import type { PlacedBlip } from '../radar/layout';
import { MarkerIcon } from './BlipMarker';

type SortKey = 'number' | 'name' | 'ring';
interface Sort {
  key: SortKey;
  direction: 1 | -1;
}

interface Props {
  blips: PlacedBlip[];
  matches: ReadonlySet<string>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function compare(a: PlacedBlip, b: PlacedBlip, sort: Sort, lang: Lang): number {
  const byNumber = a.number - b.number;
  let result = byNumber;
  if (sort.key === 'name') result = a.entry.name.localeCompare(b.entry.name, lang, { sensitivity: 'base' });
  if (sort.key === 'ring') result = ringIndex(a.entry.ring) - ringIndex(b.entry.ring) || byNumber;
  return result * sort.direction;
}

export default function ListView({ blips, matches, selectedId, onSelect }: Props) {
  const { t, lang, why } = useLocale();
  const [sort, setSort] = useState<Sort>({ key: 'ring', direction: 1 });
  const columns: Array<{ key: SortKey; label: string }> = [
    { key: 'number', label: '#' },
    { key: 'name', label: t.list.technology },
    { key: 'ring', label: t.list.ring },
  ];

  const toggleSort = (key: SortKey) =>
    setSort((current) => (current.key === key ? { key, direction: current.direction === 1 ? -1 : 1 } : { key, direction: 1 }));

  const ariaSort = (key: SortKey) => {
    if (sort.key !== key) return 'none' as const;
    return sort.direction === 1 ? ('ascending' as const) : ('descending' as const);
  };

  return (
    <div className="list-wrap" role="region" aria-label={t.list.label} tabIndex={0}>
      <table className="list-table">
        <caption className="sr-only">{t.list.caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" aria-sort={ariaSort(column.key)} className={`col-${column.key}`}>
                <button type="button" className="sort-button" onClick={() => toggleSort(column.key)}>
                  {column.label}
                  <span className="sort-arrow" aria-hidden="true">
                    {sort.key === column.key ? (sort.direction === 1 ? '↑' : '↓') : '↕'}
                  </span>
                </button>
              </th>
            ))}
            <th scope="col" className="col-since">
              {t.list.since}
            </th>
            <th scope="col" className="col-used">
              {t.list.usedIn}
            </th>
            <th scope="col" className="col-why">
              {t.list.why}
            </th>
          </tr>
        </thead>
        {QUADRANTS.map((quadrant, index) => {
          const rows = blips.filter((b) => b.entry.quadrant === quadrant.id).sort((a, b) => compare(a, b, sort, lang));
          return (
            <tbody key={quadrant.id}>
              <tr className="list-group">
                <th scope="rowgroup" colSpan={6}>
                  <span className="legend-index">{pad2(index + 1)}</span>
                  {t.quadrants[quadrant.id]}
                  <span className="list-group-count">{rows.length}</span>
                </th>
              </tr>
              {rows.map(({ entry, number }) => {
                const classes = [entry.id === selectedId && 'is-selected', !matches.has(entry.id) && 'is-dimmed']
                  .filter(Boolean)
                  .join(' ');
                return (
                  <tr key={entry.id} className={classes || undefined} data-testid="list-row">
                    <td className="col-number">
                      <span className={`legend-num ring-bg-${entry.ring}`}>{number}</span>
                    </td>
                    <th scope="row" className="col-name">
                      <button
                        type="button"
                        className="list-name"
                        aria-pressed={entry.id === selectedId}
                        onClick={() => onSelect(entry.id)}
                      >
                        {entry.name}
                      </button>
                      {entry.movement !== 'none' && <MarkerIcon movement={entry.movement} ring={entry.ring} size={14} />}
                    </th>
                    <td className="col-ring">
                      <span className={`ring-pill ring-${entry.ring}`}>{t.rings[entry.ring].name}</span>
                    </td>
                    <td className="col-since">{entry.since ?? '—'}</td>
                    <td className="col-used">
                      {entry.usedIn.length > 0 ? entry.usedIn.map((id) => projectsById.get(id)?.title ?? id).join(', ') : '—'}
                    </td>
                    <td className="col-why">{why(entry)}</td>
                  </tr>
                );
              })}
            </tbody>
          );
        })}
      </table>
    </div>
  );
}
