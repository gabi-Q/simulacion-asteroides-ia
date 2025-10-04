'use client'

import type { PlanetData } from "@/lib/planet-data"
import { Eye, Orbit, Atom, Milestone, Goal, Ruler, CircleDot } from "lucide-react"
import ObjectInfo from "./object-info"
import { PropertyCard } from "./ui/info-card"

interface PlanetInfoProps {
    planet: PlanetData
    onClose: () => void
    isVisible: boolean
    onFollow: () => void
    isFollowed: boolean
}

export default function PlanetInfo({ planet, onClose, isVisible, onFollow, isFollowed }: PlanetInfoProps) {

    return (
        <ObjectInfo
            name={planet.name}
            type={planet.type}
            onClose={onClose}
            isVisible={isVisible}
            onFollow={onFollow}
            isFollowed={isFollowed}
        >
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{planet.description}</p>

                <div className="grid grid-cols-2 gap-3">
                    <PropertyCard
                        icon={Ruler}
                        label="Diameter"
                        value={planet.diameter}
                        unit="km"
                    />
                    <PropertyCard
                        icon={CircleDot}
                        label="Distance from Sun"
                        value={planet.realDistanceFromSun}
                        unit="million km"
                    />
                    <PropertyCard
                        icon={Orbit}
                        label="Day Length"
                        value={planet.dayLength}
                    />
                    <PropertyCard
                        icon={Orbit}
                        label="Year Length"
                        value={planet.yearLength}
                    />
                    {planet.moons && (
                        <PropertyCard
                            icon={Milestone}
                            label="Moons"
                            value={planet.moons.length}
                        />
                    )}
                </div>
            </div>
        </ObjectInfo>
    )
}
