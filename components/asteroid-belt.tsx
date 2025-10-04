'use client'

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';

interface AsteroidBeltProps {
    simulationSpeed: number;
}

const AsteroidBelt = ({ simulationSpeed }: AsteroidBeltProps) => {
  const asteroidRef = useRef<any>();

  const [asteroidTexture] = useLoader(TextureLoader, ['/textures/planets/2k_mercury.jpg']);

  // Create a set of asteroids with random positions
  const asteroids = new Array(1000).fill(0).map(() => ({
    position: [
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 60,
    ],
    size: Math.random() * 0.05 + 0.01,
  }));

  useFrame((state, delta) => {
    if (asteroidRef.current) {
      asteroidRef.current.rotation.y += delta * 0.05 * simulationSpeed;
    }
  });

  return (
    <group ref={asteroidRef}>
      {asteroids.map((asteroid, i) => (
        <mesh key={i} position={asteroid.position as [number, number, number]}>
          <sphereGeometry args={[asteroid.size, 8, 8]} />
          <meshStandardMaterial map={asteroidTexture} />
        </mesh>
      ))}
    </group>
  );
};

export default AsteroidBelt;
