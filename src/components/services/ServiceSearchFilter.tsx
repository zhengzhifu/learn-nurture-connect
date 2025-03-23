
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ServiceType } from '@/types/service';
import { ServiceFilters } from '@/services/api/serviceClient';
import SearchBar from './filters/SearchBar';
import FilterPopoverContent from './filters/FilterPopoverContent';

interface ServiceSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTypes: ServiceType[];
  setSelectedTypes: (types: ServiceType[]) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
  selectedAvailability: string[];
  setSelectedAvailability: (availability: string[]) => void;
  onSearch: (e: React.FormEvent) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

const ServiceSearchFilter: React.FC<ServiceSearchFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTypes,
  setSelectedTypes,
  locationFilter,
  setLocationFilter,
  priceRange,
  setPriceRange,
  selectedSubjects,
  setSelectedSubjects,
  selectedAvailability,
  setSelectedAvailability,
  onSearch,
  applyFilters,
  clearFilters,
}) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-2">
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={onSearch}
      />

      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <FilterPopoverContent 
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedSubjects={selectedSubjects}
            setSelectedSubjects={setSelectedSubjects}
            selectedAvailability={selectedAvailability}
            setSelectedAvailability={setSelectedAvailability}
            clearFilters={clearFilters}
            applyFilters={applyFilters}
            closeFilters={() => setIsFilterOpen(false)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ServiceSearchFilter;
