
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAddressAutocomplete } from '@/hooks/useAddressAutocomplete';

interface LocationFilterProps {
  locationFilter: string;
  setLocationFilter: (location: string) => void;
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  locationFilter,
  setLocationFilter
}) => {
  const handleAddressChange = (addressData: any) => {
    // Use formatted address from Google Places
    setLocationFilter(addressData.home_address);
  };

  // Use the same hook that's used in the profile page
  const { autocompleteInputRef, isLoadingScript, googleLoaded } = useAddressAutocomplete({
    initialAddress: { home_address: locationFilter },
    onAddressChange: handleAddressChange
  });

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold mb-2">Location</h3>
      <div className="space-y-2">
        <div>
          <Label htmlFor="location_filter">Search by location</Label>
          <Input
            id="location_filter"
            ref={autocompleteInputRef}
            placeholder={isLoadingScript ? "Loading location service..." : "Enter location"}
            className="w-full"
            disabled={isLoadingScript}
          />
          {isLoadingScript && (
            <p className="text-xs text-muted-foreground mt-1">
              Loading location service...
            </p>
          )}
        </div>
        
        {locationFilter && (
          <div className="flex items-center justify-between">
            <p className="text-sm">Selected: {locationFilter}</p>
            <button 
              onClick={() => setLocationFilter('')}
              className="text-xs text-destructive hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationFilter;
