'use client'

import { Button } from "@/components/ui/button"

interface SpeedControlsProps {
    currentSpeed: number;
    onSpeedChange: (speed: number) => void;
}

const speedOptions = [
    { label: "Pausa", speed: 0 },
    { label: "1x", speed: 1 },
    { label: "10x", speed: 10 },
    { label: "100x", speed: 100 },
    { label: "1000x", speed: 1000 },
];

export default function SpeedControls({ currentSpeed, onSpeedChange }: SpeedControlsProps) {
    return (
        <div className="flex items-center gap-2 ">
            <span className="text-white hidden sm:inline">Velocidad:</span>
            <div className="flex items-center gap-1 rounded-md bg-gray-800/50 p-1 backdrop-blur-sm">
                {speedOptions.map(({ label, speed }) => (
                    <Button
                        key={speed}
                        variant={currentSpeed === speed ? "default" : "ghost"}
                        onClick={() => onSpeedChange(speed)}
                        className={`px-3 py-1 text-sm h-auto ${currentSpeed !== speed && "text-gray-300 hover:bg-gray-700/50"}`}>
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    )
}
