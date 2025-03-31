
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { MapPin } from 'lucide-react';
import { useAddressAutocomplete } from '@/hooks/useAddressAutocomplete';

interface LocationFilterProps {
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  locationRadius: number;
  setLocationRadius: (radius: number) => void;
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  locationFilter,
  setLocationFilter,
  locationRadius,
  setLocationRadius
}) => {
  const handleAddressChange = (addressData: any) => {
    // Use formatted address from Google Places
    setLocationFilter(addressData.home_address);
  };

  // Use the same hook that's used in the profile page
  const { autocompleteInputRef, isLoadingScript, googleLoaded, userLocation } = useAddressAutocomplete({
    initialAddress: { home_address: locationFilter },
    onAddressChange: handleAddressChange
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
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm">Selected: {locationFilter}</p>
              <button 
                onClick={() => setLocationFilter('')}
                className="text-xs text-destructive hover:underline"
              >
                Clear
              </button>
            </div>

            {/* Radius slider that appears when a location is selected */}
            <div className="mt-3 space-y-2">
              <Label htmlFor="radius_slider">Distance radius: {locationRadius} miles</Label>
              <Slider
                id="radius_slider"
                min={1}
                max={50}
                step={1}
                value={[locationRadius]}
                onValueChange={(values) => setLocationRadius(values[0])}
                className="py-2"
              />
              <p className="text-xs text-muted-foreground">
                Show services within {locationRadius} miles of selected location
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LocationFilter;
