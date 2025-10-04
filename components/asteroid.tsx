'use client'

import React, { useRef, useMemo, useState, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { AsteroidData } from '@/lib/space-objects-data';
import { useMobile } from "@/lib/hooks/use-mobile"
import { Text } from '@react-three/drei';

interface AsteroidProps {
  asteroid: AsteroidData;
  simulationSpeed: number;
  onClick: (asteroid: AsteroidData) => void;
  isFollowed: boolean;
  controlsRef: any;
}

const Asteroid = forwardRef<THREE.Group, AsteroidProps>(({ asteroid, simulationSpeed, onClick, isFollowed, controlsRef }, ref) => {
  const asteroidRef = useRef<THREE.Mesh>(null!)
  const textRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [asteroidTexture] = useLoader(THREE.TextureLoader, [asteroid.textureUrl]);
  const orbitAngle = useRef(Math.random() * Math.PI * 2);
  const isMobile = useMobile()

  const orbitGeometry = useMemo(() => {
        const points = []
        const segments = isMobile ? 32 : 64
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2
            const x = Math.cos(angle) * asteroid.distanceFromSun
            const z = Math.sin(angle) * asteroid.distanceFromSun
            points.push(new THREE.Vector3(x, 0, z))
        }
        return new THREE.BufferGeometry().setFromPoints(points)
    }, [asteroid.distanceFromSun, isMobile])

  useFrame((state, delta) => {
    const orbitRef = ref as React.RefObject<THREE.Group>;
    if (orbitRef.current) {
        orbitAngle.current += delta * asteroid.orbitSpeed * simulationSpeed;
        const x = asteroid.distanceFromSun * Math.cos(orbitAngle.current);
        const z = asteroid.distanceFromSun * Math.sin(orbitAngle.current);
        orbitRef.current.position.set(x, 0, z);
        orbitRef.current.rotation.y += delta * 0.1 * simulationSpeed;
    }

    if (textRef.current && hovered) {
        textRef.current.lookAt(state.camera.position)
    }
    
    if (isFollowed && asteroidRef.current && controlsRef.current) {
        const asteroidWorldPosition = new THREE.Vector3();
        asteroidRef.current.getWorldPosition(asteroidWorldPosition);
        
        const distance = asteroid.size * 20;
        const offset = new THREE.Vector3(distance, distance, distance);
        
        const newCameraPosition = new THREE.Vector3();
        newCameraPosition.copy(asteroidWorldPosition).add(offset);
        
        state.camera.position.lerp(newCameraPosition, 0.1);
        controlsRef.current.target.lerp(asteroidWorldPosition, 0.1);
        controlsRef.current.update();
    }
  });

  return (
    <group>
        <primitive object={new THREE.Line(orbitGeometry, new THREE.LineBasicMaterial({ color: "#d6baff", transparent: true, opacity: 0.2, linewidth: 1}))} />
        <group ref={ref}>
            <mesh 
                ref={asteroidRef}
                onClick={() => onClick(asteroid)}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[asteroid.size, 16, 16]} />
                <meshStandardMaterial 
                    map={asteroidTexture} 
                    roughness={0.8} 
                    metalness={0.2}
                />
            </mesh>
            
            {(hovered && !isMobile) && (
                <group ref={textRef}>
                    <Text
                        position={[0, asteroid.size + 0.1, 0]}
                        fontSize={0.1}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {asteroid.name}
                    </Text>
                </group>
            )}
        </group>
    </group>
  );
});

Asteroid.displayName = 'Asteroid';

export default Asteroid;
