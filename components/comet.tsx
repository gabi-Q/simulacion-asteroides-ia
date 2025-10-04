'use client'

import React, { useRef, useMemo, useState, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { CometData } from '@/lib/space-objects-data';
import { useMobile } from "@/lib/hooks/use-mobile"
import { Text } from '@react-three/drei';

interface CometProps {
  comet: CometData;
  simulationSpeed: number;
  onClick: (comet: CometData) => void;
  isFollowed: boolean;
  controlsRef: any;
}

const Comet = forwardRef<THREE.Group, CometProps>(({ comet, simulationSpeed, onClick, isFollowed, controlsRef }, ref) => {
  const cometMeshRef = useRef<THREE.Mesh>(null!);
  const tailRef = useRef<THREE.Mesh>(null!);
  const textRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const orbitAngle = useRef(Math.random() * Math.PI * 2);
  const isMobile = useMobile()

  const [cometTexture] = useLoader(THREE.TextureLoader, ['/textures/planets/2k_mercury.jpg']);

  const orbitGeometry = useMemo(() => {
        const points = []
        const segments = isMobile ? 32 : 64
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2
            const x = Math.cos(angle) * comet.distanceFromSun
            const z = Math.sin(angle) * comet.distanceFromSun * 1.5 // Elliptical orbit
            points.push(new THREE.Vector3(x, 0, z))
        }
        return new THREE.BufferGeometry().setFromPoints(points)
    }, [comet.distanceFromSun, isMobile])

  const tailGeometry = useMemo(() => {
    const geom = new THREE.ConeGeometry(comet.size / 1.5, comet.size * 6, 32);
    geom.translate(0, comet.size * 3, 0);
    geom.rotateX(Math.PI / 2); 
    geom.rotateY(Math.PI); 
    return geom;
  }, [comet.size]);

  useFrame((state, delta) => {
    const cometGroupRef = ref as React.RefObject<THREE.Group>;
    if (cometGroupRef.current && tailRef.current) {
      orbitAngle.current += delta * comet.orbitSpeed * simulationSpeed;
      const x = comet.distanceFromSun * Math.cos(orbitAngle.current);
      const z = comet.distanceFromSun * Math.sin(orbitAngle.current) * 1.5;
      cometGroupRef.current.position.set(x, 0, z);
      
      if(cometMeshRef.current) {
        cometMeshRef.current.rotation.y += delta * 0.05 * simulationSpeed;
      }

      const sunPosition = new THREE.Vector3(0, 0, 0);
      tailRef.current.lookAt(sunPosition);
    }
    
    if (textRef.current && hovered) {
        textRef.current.lookAt(state.camera.position)
    }

    if (isFollowed && cometMeshRef.current && controlsRef.current) {
        const cometWorldPosition = new THREE.Vector3();
        cometMeshRef.current.getWorldPosition(cometWorldPosition);

        const distance = comet.size * 30;
        const offset = new THREE.Vector3(distance, distance, distance);

        const newCameraPosition = new THREE.Vector3();
        newCameraPosition.copy(cometWorldPosition).add(offset);

        state.camera.position.lerp(newCameraPosition, 0.1);
        controlsRef.current.target.lerp(cometWorldPosition, 0.1);
        controlsRef.current.update();
    }
  });

  return (
    <group>
        <primitive object={new THREE.Line(orbitGeometry, new THREE.LineBasicMaterial({ color: "#d6baff", transparent: true, opacity: 0.2, linewidth: 1}))} />
        <group ref={ref}>
            <mesh ref={cometMeshRef}>
                <sphereGeometry args={[comet.size, 32, 32]} />
                <meshStandardMaterial 
                    map={cometTexture} 
                    roughness={0.8} 
                    metalness={0.1}
                />
            </mesh>
            <mesh ref={tailRef} position={[0, 0, 0]}>
                <primitive object={tailGeometry} attach="geometry" />
                <meshStandardMaterial 
                    color="lightblue" 
                    transparent 
                    opacity={0.6} 
                    emissive="lightblue" 
                    emissiveIntensity={0.5} 
                />
            </mesh>

            {(hovered && !isMobile) && (
                <group ref={textRef}>
                    <Text
                        position={[0, comet.size + 0.2, 0]}
                        fontSize={0.1}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {comet.name}
                    </Text>
                </group>
            )}

            {/* Hitbox */}
            <mesh 
                onClick={() => onClick(comet)} 
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={[10, 10, 10]}
            >
                <sphereGeometry args={[comet.size, 32, 32]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
        </group>
    </group>
  );
});

Comet.displayName = 'Comet';

export default Comet;
