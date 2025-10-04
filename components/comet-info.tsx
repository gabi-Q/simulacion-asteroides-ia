'use client'

import type { CometData } from "@/lib/space-objects-data"
import { Orbit, Atom, Ruler, CircleDot } from "lucide-react"
import ObjectInfo from "./object-info"
import { PropertyCard } from "./ui/info-card"

interface CometInfoProps {
    comet: CometData
    onClose: () => void
    isVisible: boolean
    onFollow: () => void
    isFollowed: boolean
}

export default function CometInfo({ comet, onClose, isVisible, onFollow, isFollowed }: CometInfoProps) {
    return (
        <ObjectInfo
            name={comet.name}
            type={comet.type}
            onClose={onClose}
            isVisible={isVisible}
            onFollow={onFollow}
            isFollowed={isFollowed}
        >
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{comet.description}</p>
                <div className="grid grid-cols-2 gap-3">
                    <PropertyCard
                        icon={Ruler}
                        label="Diameter"
                        value={comet.diameter}
                        unit="km"
                    />
                    <PropertyCard
                        icon={CircleDot}
                        label="Distance from Sun"
                        value={comet.realDistanceFromSun}
                        unit="million km"
                    />
                    <PropertyCard
                        icon={Orbit}
                        label="Orbital Period"
                        value={comet.orbitalPeriod}
                    />
                </div>
            </div>
        </ObjectInfo>
    )
}
