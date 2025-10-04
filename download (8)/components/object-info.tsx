'use client'

import { X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InfoCard, InfoCardContent, InfoCardHeader, InfoCardTitle } from "@/components/ui/info-card"

interface ObjectInfoProps {
    name: string;
    type: string;
    onClose: () => void;
    isVisible: boolean;
    onFollow: () => void;
    isFollowed: boolean;
    children: React.ReactNode;
}

export default function ObjectInfo({ name, type, onClose, isVisible, onFollow, isFollowed, children }: ObjectInfoProps) {
    return (
        <div
            className={`absolute top-4 right-4 w-96 transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
        >
            <InfoCard>
                <InfoCardHeader className="flex-row items-start justify-between pb-2">
                    <div>
                        <InfoCardTitle>{name}</InfoCardTitle>
                        <p className="text-muted-foreground">{type}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 flex-shrink-0">
                        <X className="h-4 w-4" />
                    </Button>
                </InfoCardHeader>
                <InfoCardContent>
                    <div className="grid gap-4">
                        {children}
                    </div>
                    <Button variant="outline" className="w-full flex items-center gap-2 mt-4" onClick={onFollow}>
                        <Eye className="h-4 w-4" />
                        {isFollowed ? "Dejar de seguir" : "Seguir"}
                    </Button>
                </InfoCardContent>
            </InfoCard>
        </div>
    )
}
