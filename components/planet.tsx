'use client'

import React, { useRef, useState, useMemo, forwardRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import type { PlanetData } from "@/lib/planet-data"
import * as THREE from "three"
import { useMobile } from "@/lib/hooks/use-mobile"
import { useOptimizedTexture } from "@/lib/hooks/use-optimized-texture"

interface PlanetProps {
    planet: PlanetData
    simulationSpeed: number;
    onClick: () => void;
    isFollowed: boolean;
    controlsRef: any;
}

const Planet = forwardRef<THREE.Group, PlanetProps>(({ planet, simulationSpeed, onClick, isFollowed, controlsRef }, ref) => {
    const planetRef = useRef<THREE.Mesh>(null!)
    const textRef = useRef<THREE.Group>(null)
    const ringRef = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)
    const isMobile = useMobile()

    const sphereGeometry = useMemo(() => {
        const segments = isMobile ? 16 : 32
        return new THREE.SphereGeometry(planet.size, segments, segments)
    }, [planet.size, isMobile])

    const orbitGeometry = useMemo(() => {
        const points = []
        const segments = isMobile ? 32 : 64
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2
            const x = Math.cos(angle) * planet.distanceFromSun
            const z = Math.sin(angle) * planet.distanceFromSun
            points.push(new THREE.Vector3(x, 0, z))
        }
        return new THREE.BufferGeometry().setFromPoints(points)
    }, [planet.distanceFromSun, isMobile])

    const ringGeometry = useMemo(() => {
        if (planet.name !== "Saturn") return null
        const segments = isMobile ? 32 : 64
        return new THREE.RingGeometry(planet.size * 1.2, planet.size * 1.7, segments)
    }, [planet.name, planet.size, isMobile])

    const texture = useOptimizedTexture(planet.textureUrl)
    const ringTexture = useOptimizedTexture('/textures/planets/2k_saturn_ring_alpha.png')

    useFrame((state, delta) => {
        const orbitRef = ref as React.RefObject<THREE.Group>;
        if (planetRef.current) {
            planetRef.current.rotation.x = THREE.MathUtils.degToRad(planet.axialTilt)
            planetRef.current.rotation.y += delta * planet.rotationSpeed * simulationSpeed;
        }

        if (ringRef.current) {
            ringRef.current.rotation.x = THREE.MathUtils.degToRad(90 + planet.axialTilt)
        }

        if (orbitRef.current) {
            orbitRef.current.rotation.y += delta * planet.orbitSpeed * simulationSpeed;
        }

        if (textRef.current && hovered) {
            textRef.current.lookAt(state.camera.position)
        }

        if (isFollowed && planetRef.current && controlsRef.current) {
            const planetWorldPosition = new THREE.Vector3();
            planetRef.current.getWorldPosition(planetWorldPosition);
            
            const distance = planet.size * 5;
            const offset = new THREE.Vector3(distance, distance, distance);
            
            const newCameraPosition = new THREE.Vector3();
            newCameraPosition.copy(planetWorldPosition).add(offset);
            
            state.camera.position.lerp(newCameraPosition, 0.1);
            controlsRef.current.target.lerp(planetWorldPosition, 0.1);
            controlsRef.current.update();
        }
    })

    return (
        <group>
            <primitive object={new THREE.Line(orbitGeometry, new THREE.LineBasicMaterial({
                color: "#4a90e2",
                transparent: true,
                opacity: 0.3,
                linewidth: 1
            }))} />

            <group ref={ref}>
                <group position={[planet.distanceFromSun, 0, 0]}>
                    <mesh
                        ref={planetRef}
                        onClick={onClick}
                        onPointerOver={() => setHovered(true)}
                        onPointerOut={() => setHovered(false)}
                        geometry={sphereGeometry}
                    >
                        <meshStandardMaterial
                            map={texture}
                            emissive="#888888"
                            emissiveIntensity={0.05}
                            roughness={0.5}
                            metalness={0.1}
                        />
                    </mesh>

                    {planet.name === "Saturn" && ringGeometry && (
                        <mesh
                            ref={ringRef}
                            geometry={ringGeometry}
                        >
                            <meshBasicMaterial
                                map={ringTexture}
                                transparent
                                side={THREE.DoubleSide}
                                depthWrite={false}
                            />
                        </mesh>
                    )}

                    {(hovered && !isMobile) && (
                        <group ref={textRef}>
                            <Text
                                position={[0, planet.size + 1, 0]}
                                fontSize={1}
                                color="white"
                                anchorX="center"
                                anchorY="middle"
                            >
                                {planet.name}
                            </Text>
                        </group>
                    )}
                </group>
            </group>
        </group>
    )
})

Planet.displayName = 'Planet';

export default Planet;
