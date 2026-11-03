import { MOVEMENTS } from '../data/model';
import { useLocale } from '../i18n/LocaleContext';
import { MarkerIcon } from './BlipMarker';

export default function MovementKey() {
  const { t } = useLocale();
  return (
    <ul className="move-key" aria-label={t.moveKey}>
      {MOVEMENTS.map((movement) => (
        <li key={movement.id}>
          <MarkerIcon movement={movement.id} ring="adopt" size={18} />
          {t.movements[movement.id]}
        </li>
      ))}
    </ul>
  );
}
