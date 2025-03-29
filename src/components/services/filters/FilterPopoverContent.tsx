
import React from 'react';
import { FilterProps } from './FilterTypes';
import { ScrollArea } from "@/components/ui/scroll-area";
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
  radiusKm,
  setRadiusKm,
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
  // Prevent clicks inside the popover from closing it
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh]" onClick={handleContentClick}>
      <h2 className="text-lg font-semibold mb-4 px-4 pt-4">Filter Services</h2>
      
      <ScrollArea className="flex-1 px-4 pb-2 overflow-y-auto">
        <div className="pr-2"> {/* Add padding to the right to ensure content doesn't overlap with scrollbar */}
          <ServiceTypeFilter 
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
          />

          <LocationFilter 
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            radiusKm={radiusKm}
            setRadiusKm={setRadiusKm}
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

      <div className="border-t mt-2 px-4 py-3 bg-background sticky bottom-0">
        <FilterActions 
          clearFilters={clearFilters}
          applyFilters={applyFilters}
          closeFilters={closeFilters}
        />
      </div>
    </div>
  );
};

export default FilterPopoverContent;
