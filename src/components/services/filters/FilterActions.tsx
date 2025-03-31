
import React from 'react';
import { Button } from '@/components/ui/button';

interface FilterActionsProps {
  clearFilters: () => void;
  applyFilters: () => void;
  closeFilters: () => void;
}

const FilterActions: React.FC<FilterActionsProps> = ({
  clearFilters,
  applyFilters,
  closeFilters
}) => {
  return (
    <div className="flex justify-between w-full">
      <Button variant="outline" onClick={clearFilters}>
        Clear Filters
      </Button>
      <Button 
        variant="default" 
        className="bg-primary text-primary-foreground"
        onClick={applyFilters}
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterActions;
