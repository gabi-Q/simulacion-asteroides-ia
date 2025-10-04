
import { sunData, planets } from '../lib/planet-data';
import { asteroids, comets } from '../lib/space-objects-data';

const celestialObjects = [
  sunData,
  ...planets,
  ...asteroids,
  ...comets,
];

export default function CelestialSelector({ onObjectSelect }) {
  return (
    <div className="absolute top-4 left-4 z-10">
      <select
        onChange={(e) => onObjectSelect(e.target.value)}
        className="bg-gray-800/50 text-white rounded-lg p-2 backdrop-blur-sm"
      >
        <option value="">Select a celestial object</option>
        {celestialObjects.map((obj) => (
          <option key={obj.id} value={obj.id}>
            {obj.name}
          </option>
        ))}
      </select>
    </div>
  );
}
