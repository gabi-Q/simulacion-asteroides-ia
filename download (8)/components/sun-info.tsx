'use client'

import type { SunData } from "@/lib/planet-data"
import { Ruler, Thermometer, CalendarDays } from "lucide-react"
import ObjectInfo from "./object-info"
import { PropertyCard } from "./ui/info-card"

interface SunInfoProps {
    sun: SunData
    onClose: () => void
    isVisible: boolean
}

export default function SunInfo({ sun, onClose, isVisible }: SunInfoProps) {
    return (
        <ObjectInfo
            name={sun.name}
            type={sun.type}
            onClose={onClose}
            isVisible={isVisible}
            onFollow={() => {}}
        >
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{sun.description}</p>
                <div className="grid grid-cols-2 gap-3">
                    <PropertyCard
                        icon={Ruler}
                        label="Diameter"
                        value={sun.diameter.toLocaleString()}
                        unit="km"
                    />
                    <PropertyCard
                        icon={Thermometer}
                        label="Surface Temperature"
                        value={sun.surfaceTemp}
                    />
                    <PropertyCard
                        icon={CalendarDays}
                        label="Age"
                        value={sun.age}
                    />
                </div>
            </div>
        </ObjectInfo>
    )
}
