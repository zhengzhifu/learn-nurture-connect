
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  locationRadius: number;
  setLocationRadius: (radius: number) => void;
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
  locationRadius,
  setLocationRadius,
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
  
  const handleApplyFilters = () => {
    applyFilters();
    setIsFilterOpen(false);
  };
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-2">
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={onSearch}
      />

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] p-0">
          <FilterPopoverContent 
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            locationRadius={locationRadius}
            setLocationRadius={setLocationRadius}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedSubjects={selectedSubjects}
            setSelectedSubjects={setSelectedSubjects}
            selectedAvailability={selectedAvailability}
            setSelectedAvailability={setSelectedAvailability}
            clearFilters={clearFilters}
            applyFilters={handleApplyFilters}
            closeFilters={() => setIsFilterOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceSearchFilter;
