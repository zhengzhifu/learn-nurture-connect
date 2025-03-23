
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
    <div className="flex justify-between mt-6">
      <Button variant="ghost" size="sm" onClick={clearFilters}>
        Clear Filters
      </Button>
      <Button size="sm" onClick={() => {
        applyFilters();
        closeFilters();
      }}>
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterActions;
