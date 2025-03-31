
import React from 'react';
import { FilterProps } from './FilterTypes';
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from 'lucide-react';
import ServiceTypeFilter from './ServiceTypeFilter';
import LocationFilter from './LocationFilter';
import PriceRangeFilter from './PriceRangeFilter';
import SubjectsFilter from './SubjectsFilter';
import AvailabilityFilter from './AvailabilityFilter';
import FilterActions from './FilterActions';

interface FilterPopoverContentProps extends FilterProps {
  closeFilters: () => void;
}

const FilterPopoverContent: React.FC<FilterPopoverContentProps> = ({
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
  clearFilters,
  applyFilters,
  closeFilters
}) => {
  // Create a wrapper function for applying filters to also close the modal
  const handleApplyFilters = () => {
    applyFilters();
    closeFilters();
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      <div className="flex items-center justify-between pb-2 border-b mb-2 px-6 pt-6">
        <h2 className="text-xl font-semibold">Filter Services</h2>
        <button 
          onClick={closeFilters}
          className="rounded-full p-1 hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <ScrollArea className="flex-1 px-6 pb-2 overflow-y-auto">
        <div className="pr-2"> {/* Add padding to the right to ensure content doesn't overlap with scrollbar */}
          <ServiceTypeFilter 
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
          />

          <LocationFilter 
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            locationRadius={locationRadius}
            setLocationRadius={setLocationRadius}
          />

          <PriceRangeFilter 
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />

          <SubjectsFilter 
            selectedSubjects={selectedSubjects}
            setSelectedSubjects={setSelectedSubjects}
          />

          <AvailabilityFilter 
            selectedAvailability={selectedAvailability}
            setSelectedAvailability={setSelectedAvailability}
          />
        </div>
      </ScrollArea>

      <div className="border-t mt-2 px-6 py-4 bg-background sticky bottom-0">
        <FilterActions 
          clearFilters={clearFilters}
          applyFilters={handleApplyFilters}
          closeFilters={closeFilters}
        />
      </div>
    </div>
  );
};

export default FilterPopoverContent;
