'use client'

import { Button } from "@/components/ui/button"

export type FilterType = 'all' | 'planets' | 'asteroids' | 'comets';

interface FilterControlsProps {
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

const filters: { label: string; value: FilterType }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Planetas', value: 'planets' },
    { label: 'Asteroides', value: 'asteroids' },
    { label: 'Cometas', value: 'comets' },
];

const FilterControls = ({ activeFilter, onFilterChange }: FilterControlsProps) => {
    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-gray-900/50 p-2 rounded-lg">
            {filters.map((filter) => (
                <Button
                    key={filter.value}
                    variant={activeFilter === filter.value ? "default" : "outline"}
                    onClick={() => onFilterChange(filter.value)}
                >
                    {filter.label}
                </Button>
            ))}
        </div>
    );
};

export default FilterControls;
