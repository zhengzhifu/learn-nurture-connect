
import React from 'react';
import { FilterProps } from './FilterTypes';
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
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Filter Services</h2>

      <ServiceTypeFilter 
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
      />

      <LocationFilter 
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
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

      <FilterActions 
        clearFilters={clearFilters}
        applyFilters={applyFilters}
        closeFilters={closeFilters}
      />
    </div>
  );
};

export default FilterPopoverContent;
