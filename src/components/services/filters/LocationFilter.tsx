
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
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
    // Prevent event propagation that might close the popover
    setLocationFilter(addressData.home_address);
  };

  // Use the same hook that's used in the profile page
  const { autocompleteInputRef, isLoadingScript, googleLoaded, userLocation } = useAddressAutocomplete({
    initialAddress: { home_address: locationFilter },
    onAddressChange: handleAddressChange,
    preventCloseOnSelect: true // Add a flag to indicate we want to prevent closing
  });

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold mb-2">Location</h3>
      <div className="space-y-2">
        <div>
          <Label htmlFor="location_filter">Search by location</Label>
          <div className="relative">
            <Input
              id="location_filter"
              ref={autocompleteInputRef}
              placeholder={isLoadingScript ? "Loading location service..." : "Enter location"}
              className="w-full pl-9"
              disabled={isLoadingScript}
              // Prevent click event from bubbling up to the parent (popover)
              onClick={(e) => e.stopPropagation()}
            />
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {isLoadingScript && (
            <p className="text-xs text-muted-foreground mt-1">
              Loading location service...
            </p>
          )}
          {userLocation && (
            <p className="text-xs text-muted-foreground mt-1">
              Prioritizing addresses near your location
            </p>
          )}
        </div>
        
        {locationFilter && (
          <div className="flex items-center justify-between">
            <p className="text-sm">Selected: {locationFilter}</p>
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from closing the popover
                setLocationFilter('');
              }}
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
