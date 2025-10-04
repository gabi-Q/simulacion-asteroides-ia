'use client'

import type { AsteroidData } from "@/lib/space-objects-data"
import ObjectInfo from "./object-info"
import { PropertyCard } from "./ui/info-card"
import { Orbit, Atom, Milestone, Goal, Ruler, CircleDot, Info } from "lucide-react"

interface AsteroidInfoProps {
    asteroid: AsteroidData
    onClose: () => void
    isVisible: boolean
    onFollow: () => void
    isFollowed: boolean
}

export default function AsteroidInfo({ asteroid, onClose, isVisible, onFollow, isFollowed }: AsteroidInfoProps) {
    return (
        <ObjectInfo
            name={asteroid.name}
            type={asteroid.type}
            onClose={onClose}
            isVisible={isVisible}
            onFollow={onFollow}
            isFollowed={isFollowed}
        >
            <div className="grid grid-cols-2 gap-3">
                <PropertyCard
                    icon={Orbit}
                    label="Orbital Period"
                    value={asteroid.orbital_period_days}
                    unit="days"
                />
                <PropertyCard
                    icon={Atom}
                    label="Eccentricity"
                    value={asteroid.eccentricity}
                />
                <PropertyCard
                    icon={Milestone}
                    label="Inclination"
                    value={asteroid.inclination_deg}
                    unit="°"
                />
                <PropertyCard
                    icon={Goal}
                    label="Semi-Major Axis"
                    value={asteroid.semi_major_axis_au}
                    unit="au"
                />
                <PropertyCard
                    icon={Ruler}
                    label="Diameter"
                    value={asteroid.diameter}
                    unit="km"
                />
                <PropertyCard
                    icon={CircleDot}
                    label="Distance from Sun"
                    value={asteroid.realDistanceFromSun}
                    unit="million km"
                />
            </div>
        </ObjectInfo>
    )
}
