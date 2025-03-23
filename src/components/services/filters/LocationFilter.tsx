
import React from 'react';
import { Input } from '@/components/ui/input';

interface LocationFilterProps {
  locationFilter: string;
  setLocationFilter: (location: string) => void;
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  locationFilter,
  setLocationFilter
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold mb-2">Location</h3>
      <Input
        type="text"
        placeholder="Enter location"
        value={locationFilter}
        onChange={(e) => setLocationFilter(e.target.value)}
      />
    </div>
  );
};

export default LocationFilter;
