
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { formatPriceRange } from './FilterTypes';

interface PriceRangeFilterProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  priceRange,
  setPriceRange
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold mb-2">Price Range</h3>
      <Slider
        defaultValue={priceRange}
        max={100}
        step={10}
        onValueChange={(value) => setPriceRange([value[0], value[1]])}
      />
      <p className="text-sm mt-1">{formatPriceRange(priceRange)}</p>
    </div>
  );
};

export default PriceRangeFilter;
