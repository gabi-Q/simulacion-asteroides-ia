'use client'

import React, { useState, useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from 'three';
import { useMobile } from "@/lib/hooks/use-mobile"
import { type PlanetData, planets, sunData, SunData } from "@/lib/planet-data"
import { type AsteroidData, type CometData, asteroids, comets } from "@/lib/space-objects-data"
import Planet from "@/components/planet"
import PlanetInfo from "@/components/planet-info"
import Sun from "@/components/sun"
import Galaxy from "@/components/galaxy"
import SunInfo from "./sun-info"
import AsteroidBelt from "./asteroid-belt"
import Comet from "./comet"
import AsteroidInfo from "./asteroid-info"
import CometInfo from "./comet-info"
import FullscreenButton from "./fullscreen-button"
import LoadingScreen from "./loading-screen"
import Asteroid from "./asteroid"
import SpeedControls from "./speed-controls"
import FilterControls, { FilterType } from "./filter-controls"
import AiSearch from "./ai-search";
import CelestialSelector from "./celestial-selector";

type SearchableObject = {
  id: string;
  name: string;
  type: 'planet' | 'asteroid' | 'comet' | 'sun';
  ref: React.RefObject<THREE.Group>;
};

export default function SolarSystem() {
    const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null)
    const [selectedSun, setSelectedSun] = useState<SunData | null>(null)
    const [selectedAsteroid, setSelectedAsteroid] = useState<AsteroidData | null>(null)
    const [selectedComet, setSelectedComet] = useState<CometData | null>(null)
    const [isInfoVisible, setIsInfoVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [simulationSpeed, setSimulationSpeed] = useState(4);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [followedObject, setFollowedObject] = useState<any>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [viewTarget, setViewTarget] = useState(new THREE.Vector3(0, 0, 0));
    const controlsRef = useRef<any>(null)
    const isMobile = useMobile()

    const objectRefs = useRef<{[key: string]: React.RefObject<THREE.Group>}>({});

    const searchableObjects: SearchableObject[] = useMemo(() => {
        const getRef = (id: string) => {
            if (!objectRefs.current[id]) {
                objectRefs.current[id] = React.createRef<THREE.Group>();
            }
            return objectRefs.current[id];
        };

        const sun: SearchableObject = { id: 'sun', name: 'Sun', type: 'sun', ref: getRef('sun') };
        const planetObjects: SearchableObject[] = planets.map(p => ({ id: p.id, name: p.name, type: 'planet', ref: getRef(p.id) }));
        const asteroidObjects: SearchableObject[] = asteroids.map(a => ({ id: a.id, name: a.name, type: 'asteroid', ref: getRef(a.id) }));
        const cometObjects: SearchableObject[] = comets.map(c => ({ id: c.id, name: c.name, type: 'comet', ref: getRef(c.id) }));
        
        const allObjects = [...planetObjects, ...asteroidObjects, ...cometObjects];
        allObjects.sort((a, b) => a.name.localeCompare(b.name));
        
        return [sun, ...allObjects];
    }, []);

    const cameraPosition: [number, number, number] = isMobile ? [0, 20, 40] : [0, 20, 30]
    const cameraFov = isMobile ? 60 : 45 

    const handleSunClick = () => {
        setSelectedSun(sunData)
        setSelectedPlanet(null)
        setSelectedAsteroid(null)
        setSelectedComet(null)
        setIsInfoVisible(true)
        setFollowedObject(null);
        setViewTarget(new THREE.Vector3(0, 0, 0)); 
    }

    const handlePlanetClick = (planet: PlanetData) => {
        setSelectedPlanet(planet)
        setSelectedSun(null)
        setSelectedAsteroid(null)
        setSelectedComet(null)
        setIsInfoVisible(true)
    }
    
    const handleAsteroidClick = (asteroid: AsteroidData) => {
        setSelectedAsteroid(asteroid)
        setSelectedPlanet(null)
        setSelectedSun(null)
        setSelectedComet(null)
        setIsInfoVisible(true)
    }
    
    const handleCometClick = (comet: CometData) => {
        setSelectedComet(comet)
        setSelectedPlanet(null)
        setSelectedSun(null)
        setSelectedAsteroid(null)
        setIsInfoVisible(true)
    }
    
    const handleFollowToggle = (object: any) => {
        if (followedObject && followedObject.id === object.id) {
            setFollowedObject(null);
            setIsResetting(true);
        } else {
            setFollowedObject(object);
            setIsResetting(false);
        }
    };

    const handleObjectSelect = (object: SearchableObject) => {
        const searchable = searchableObjects.find(s => s.id === (object.id || object.name));

        if (object.type === 'sun') {
            handleSunClick();
            setIsResetting(true);
        } else if (object.type === 'planet') {
            const planet = planets.find(p => p.id === object.id);
            if (planet && searchable) {
                handlePlanetClick(planet);
                handleFollowToggle(searchable);
            }
        } else if (object.type === 'asteroid') {
            const asteroid = asteroids.find(a => a.id === object.id);
            if (asteroid && searchable) {
                handleAsteroidClick(asteroid);
                handleFollowToggle(searchable);
            }
        } else if (object.type === 'comet') {
            const comet = comets.find(c => c.id === object.id);
            if (comet && searchable) {
                handleCometClick(comet);
                handleFollowToggle(searchable);
            }
        }
    };
    const handleSelectorChange = (id: string) => {
        const object = searchableObjects.find(o => o.id === id);
        if (object) {
            handleObjectSelect(object);
        }
    };

    const handleCloseInfo = () => {
        setIsInfoVisible(false)
        setFollowedObject(null); 
        setIsResetting(true);
        setViewTarget(new THREE.Vector3(0, 0, 0)); 
        setTimeout(() => {
            setSelectedPlanet(null)
            setSelectedSun(null)
            setSelectedAsteroid(null)
            setSelectedComet(null)
        }, 300)
    }
    
    const handleSpeedChange = (speed: number) => {
        setSimulationSpeed(speed);
    };

    const handleFilterChange = (filter: FilterType) => {
        setActiveFilter(filter);
        handleCloseInfo();

        if (filter === 'comets' && comets.length > 0) {
            const ref = objectRefs.current[comets[0].id]?.current;
            setViewTarget(ref ? ref.position : new THREE.Vector3(0,0,0));
        } else if (filter === 'asteroids' && asteroids.length > 0) {
            const ref = objectRefs.current[asteroids[0].id]?.current;
            setViewTarget(ref ? ref.position : new THREE.Vector3(0,0,0));
        } else {
            setViewTarget(new THREE.Vector3(0, 0, 0));
        }
    };

    const CameraController = () => {
        useFrame((state) => {
            if (isResetting && controlsRef.current) {
                const initialCamPos = new THREE.Vector3(...cameraPosition);
                state.camera.position.lerp(initialCamPos, 0.05);
                controlsRef.current.target.lerp(viewTarget, 0.05);
                controlsRef.current.update();

                if (state.camera.position.distanceTo(initialCamPos) < 0.1 && controlsRef.current.target.distanceTo(viewTarget) < 0.1) {
                    state.camera.position.copy(initialCamPos);
                    controlsRef.current.target.copy(viewTarget);
                    controlsRef.current.update();
                    setIsResetting(false);
                }
            }
        });
        return null;
    };

    return (
        <div className="relative w-full h-full">
            {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
            <FullscreenButton />
            <CelestialSelector onObjectSelect={handleSelectorChange} />
            <FilterControls activeFilter={activeFilter} onFilterChange={handleFilterChange} />
            <Canvas
                camera={{
                    position: cameraPosition,
                    fov: cameraFov,
                    near: 0.1,
                    far: 1000,
                }}
                gl={{
                    powerPreference: "high-performance",
                    stencil: false,
                    depth: true,
                    alpha: false,
                }}
            >
                <CameraController />
                <color attach="background" args={["#000"]} />
                <ambientLight intensity={0.1} />
                <pointLight position={[0, 0, 0]} intensity={1.5} />
                <Galaxy />
                <Sun onClick={handleSunClick} ref={objectRefs.current['sun']} />
                {(activeFilter === 'all' || activeFilter === 'planets') && planets.map((planet) => (
                    <Planet
                        key={planet.name}
                        planet={planet}
                        simulationSpeed={simulationSpeed}
                        onClick={() => handlePlanetClick(planet)}
                        isFollowed={followedObject?.id === planet.id}
                        controlsRef={controlsRef}
                        ref={objectRefs.current[planet.id]}
                    />
                ))}
                {(activeFilter === 'all' || activeFilter === 'asteroids') && (
                    <>
                        <AsteroidBelt simulationSpeed={simulationSpeed} />
                        {asteroids.map((asteroid) => (
                            <Asteroid
                                key={asteroid.id}
                                asteroid={asteroid}
                                simulationSpeed={simulationSpeed}
                                onClick={() => handleAsteroidClick( asteroid)}
                                isFollowed={followedObject?.id === asteroid.id}
                                controlsRef={controlsRef}
                                ref={objectRefs.current[asteroid.id]}
                            />
                        ))}
                    </>
                )}
                {(activeFilter === 'all' || activeFilter === 'comets') && comets.map((comet) => (
                    <Comet
                        key={comet.id}
                        comet={comet}
                        simulationSpeed={simulationSpeed}
                        onClick={() => handleCometClick(comet)}
                        isFollowed={followedObject?.id === comet.id}
                        controlsRef={controlsRef}
                        ref={objectRefs.current[comet.id]}
                    />
                ))}
                <OrbitControls
                    ref={controlsRef}
                    enablePan={true}
                    minDistance={5}
                    maxDistance={100}
                />
                <EffectComposer>
                    <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} height={300} />
                </EffectComposer>
            </Canvas>

            {/* Bottom controls wrapper */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end pointer-events-none">
                <div className="flex items-end gap-4 pointer-events-auto">
                    <SpeedControls currentSpeed={simulationSpeed} onSpeedChange={handleSpeedChange} />
                    <AiSearch objects={searchableObjects} onObjectSelect={handleObjectSelect} />
                </div>
            </div>

            {selectedPlanet && (
                <PlanetInfo
                    planet={selectedPlanet}
                    onClose={handleCloseInfo}
                    isVisible={isInfoVisible}
                    onFollow={() => handleFollowToggle(searchableObjects.find(s => s.id === selectedPlanet.id))}
                    isFollowed={followedObject?.id === selectedPlanet.id}
                />
            )}

            {selectedSun && (
                <SunInfo
                    sun={selectedSun}
                    onClose={handleCloseInfo}
                    isVisible={isInfoVisible}
                />
            )}
            
            {selectedAsteroid && (
                <AsteroidInfo
                    asteroid={selectedAsteroid}
                    onClose={handleCloseInfo}
                    isVisible={isInfoVisible}
                    onFollow={() => handleFollowToggle(searchableObjects.find(s => s.id === selectedAsteroid.id))}
                    isFollowed={followedObject?.id === selectedAsteroid.id}
                />
            )}

            {selectedComet && (
                <CometInfo
                    comet={selectedComet}
                    onClose={handleCloseInfo}
                    isVisible={isInfoVisible}
                    onFollow={() => handleFollowToggle(searchableObjects.find(s => s.id === selectedComet.id))}
                    isFollowed={followedObject?.id === selectedComet.id}
                />
            )}
        </div>
    )
}
