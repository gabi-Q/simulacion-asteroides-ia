'use client'

import { useMemo } from 'react';

type SearchableObject = {
  id: string;
  name: string;
  type: 'planet' | 'asteroid' | 'comet' | 'sun';
};

interface SearchControlProps {
  objects: SearchableObject[];
  onObjectSelect: (object: SearchableObject) => void;
}

const SearchControl = ({ objects, onObjectSelect }: SearchControlProps) => {
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    if (selectedId) {
      const selectedObject = objects.find(obj => obj.id === selectedId);
      if (selectedObject) {
        onObjectSelect(selectedObject);
      }
    } 
    event.target.value = ""; // Reset dropdown after selection
  };

  const groupedObjects = useMemo(() => {
    const sun = objects.find(obj => obj.type === 'sun');
    const planets = objects.filter(obj => obj.type === 'planet');
    const asteroids = objects.filter(obj => obj.type === 'asteroid');
    const comets = objects.filter(obj => obj.type === 'comet');
    return { sun, planets, asteroids, comets };
  }, [objects]);

  return (
    <div className="absolute top-4 left-4 z-10 bg-transparent p-2 rounded-md">
      <select 
        onChange={handleSelect}
        className="bg-gray-800/50 text-white p-2 rounded-md backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        defaultValue=""
      >
        <option value="" disabled>Selecciona un objeto para viajar</option>
        
        {groupedObjects.sun && <option key={groupedObjects.sun.id} value={groupedObjects.sun.id}>{groupedObjects.sun.name}</option>}

        {groupedObjects.planets.length > 0 && (
          <optgroup label="Planetas">
            {groupedObjects.planets.map(obj => (
              <option key={obj.id} value={obj.id}>
                {obj.name}
              </option>
            ))}
          </optgroup>
        )}

        {groupedObjects.asteroids.length > 0 && (
          <optgroup label="Asteroides">
            {groupedObjects.asteroids.map(obj => (
              <option key={obj.id} value={obj.id}>
                {obj.name}
              </option>
            ))}
          </optgroup>
        )}

        {groupedObjects.comets.length > 0 && (
          <optgroup label="Cometas">
            {groupedObjects.comets.map(obj => (
              <option key={obj.id} value={obj.id}>
                {obj.name}
              </option>
            ))}
          </optgroup>
        )}
      </select>
    </div>
  );
};

export default SearchControl;