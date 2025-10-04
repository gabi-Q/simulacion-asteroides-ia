'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

const InfoCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("rounded-lg bg-card text-card-foreground", className)}
        {...props}
    />
))
InfoCard.displayName = "InfoCard"

const InfoCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
InfoCardHeader.displayName = "InfoCardHeader"

const InfoCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("text-2xl font-semibold leading-none tracking-tight text-primary", className)}
        {...props}
    />
))
InfoCardTitle.displayName = "InfoCardTitle"

const InfoCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("p-6 pt-0 grid gap-4", className)}
        {...props}
    />
))
InfoCardContent.displayName = "InfoCardContent"

interface PropertyCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    unit?: string;
    className?: string;
}

const PropertyCard = ({ icon: Icon, label, value, unit, className }: PropertyCardProps) => (
    <div className={cn("flex items-start gap-3", className)}>
        <Icon className="size-5 flex-shrink-0 text-primary" />
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-base font-bold text-foreground">
                {value}
                {unit && <span className="text-xs font-normal text-muted-foreground ml-1">{unit}</span>}
            </p>
        </div>
    </div>
)
PropertyCard.displayName = "PropertyCard"


export { InfoCard, InfoCardHeader, InfoCardTitle, InfoCardContent, PropertyCard }
