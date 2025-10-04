'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlanetData, planets } from '@/lib/planet-data';
import { AsteroidData, asteroids, CometData, comets } from '@/lib/space-objects-data';

type SearchableObject = any;

interface AiSearchProps {
  objects: SearchableObject[];
  onObjectSelect: (object: SearchableObject) => void;
}

const objectNameTranslations: { [key: string]: string } = {
    'mercurio': 'Mercury',
    'venus': 'Venus',
    'tierra': 'Earth',
    'marte': 'Mars',
    'jupiter': 'Jupiter',
    'saturno': 'Saturn',
    'urano': 'Uranus',
    'neptuno': 'Neptune',
    'sol': 'Sun',
    'ceres': 'Ceres',
    'vesta': 'Vesta',
    'cometa halley': "Halley's Comet"
};

function normalizeString(str: string): string {
    return str.toLowerCase().trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function findClosestPlanet(planetName: string): PlanetData | null {
  const englishPlanetName = objectNameTranslations[planetName];
  if (!englishPlanetName) return null;

  const referencePlanet = planets.find(p => p.name.toLowerCase() === englishPlanetName.toLowerCase());
  if (!referencePlanet) return null;

  let closestPlanet: PlanetData | null = null;
  let minDistance = Infinity;

  planets.forEach(p => {
    if (p.name !== referencePlanet.name) {
      const distance = Math.abs(p.realDistanceFromSun - referencePlanet.realDistanceFromSun);
      if (distance < minDistance) {
        minDistance = distance;
        closestPlanet = p;
      }
    }
  });

  return closestPlanet;
}

export default function AiSearch({ objects, onObjectSelect }: AiSearchProps) {
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    const normalizedQuery = normalizeString(query);
    
    if (normalizedQuery.includes('planeta mas cercano a')) {
      let planetName = normalizedQuery.split('planeta mas cercano a')[1].trim();
      
      const articles = ['la ', 'el '];
      for (const article of articles) {
          if(planetName.startsWith(article)) {
              planetName = planetName.substring(article.length);
          }
      }

      const closestPlanet = findClosestPlanet(planetName);
      if (closestPlanet) {
        const searchableObject = objects.find(o => o.id.toLowerCase() === closestPlanet.name.toLowerCase());
        if (searchableObject) {
          onObjectSelect(searchableObject);
          setQuery('');
        }
      }
    } else if (normalizedQuery.includes('asteroide')) {
        // For now, just select the first asteroid
        const asteroid = asteroids[0];
        const searchableObject = objects.find(o => o.id === asteroid.id);
        if (searchableObject) {
            onObjectSelect(searchableObject);
            setQuery('');
        }
    } else if (normalizedQuery.includes('cometa')) {
        // For now, just select the first comet
        const comet = comets[0];
        const searchableObject = objects.find(o => o.id === comet.id);
        if (searchableObject) {
            onObjectSelect(searchableObject);
            setQuery('');
        }
    } else {
      const englishObjectName = objectNameTranslations[normalizedQuery];
      if (englishObjectName) {
        const foundObject = objects.find(o => o.name.toLowerCase() === englishObjectName.toLowerCase());
        if (foundObject) {
          onObjectSelect(foundObject);
          setQuery('');
        }
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Ej: planeta más cercano a la Tierra"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        className="bg-gray-800/50 text-white p-2 rounded-md backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-72"
      />
      <Button onClick={handleSearch}>Buscar</Button>
    </div>
  )
}
