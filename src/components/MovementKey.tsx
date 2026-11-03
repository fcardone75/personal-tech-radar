import { MOVEMENTS } from '../data/model';
import { MarkerIcon } from './BlipMarker';

export default function MovementKey() {
  return (
    <ul className="move-key" aria-label="Blip shapes">
      {MOVEMENTS.map((movement) => (
        <li key={movement.id}>
          <MarkerIcon movement={movement.id} ring="adopt" size={18} />
          {movement.name}
        </li>
      ))}
    </ul>
  );
}
