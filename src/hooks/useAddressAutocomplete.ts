
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { loadGoogleMapsScript, parseGooglePlaceResult } from '@/utils/googleMaps';

export interface AddressData {
  home_address: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

interface UseAddressAutocompleteProps {
  initialAddress: AddressData;
  onAddressChange: (addressData: AddressData) => void;
  useBrowserLocation?: boolean;
}

export const useAddressAutocomplete = ({ 
  initialAddress, 
  onAddressChange,
  useBrowserLocation = true
}: UseAddressAutocompleteProps) => {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [isLoadingScript, setIsLoadingScript] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Try to get the user's location if allowed
  useEffect(() => {
    if (useBrowserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          console.log('User location detected:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log('Geolocation error:', error.message);
        }
      );
    }
  }, [useBrowserLocation]);

  // Load Google Maps script on mount
  useEffect(() => {
    const initGoogleMaps = async () => {
      setIsLoadingScript(true);
      await loadGoogleMapsScript(() => {
        setGoogleLoaded(true);
        setIsLoadingScript(false);
      });
    };
    
    initGoogleMaps();
  }, []);

  // Initialize autocomplete when Google Maps is loaded
  useEffect(() => {
    if (googleLoaded && autocompleteInputRef.current && window.google) {
      try {
        const options: google.maps.places.AutocompleteOptions = {
          types: ['address']
        };
        
        // Add location bias if we have the user's location
        if (userLocation) {
          options.bounds = new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(userLocation.lat - 0.1, userLocation.lng - 0.1),
            new window.google.maps.LatLng(userLocation.lat + 0.1, userLocation.lng + 0.1)
          );
          // Don't strictly restrict to this area, just bias the results
          options.strictBounds = false;
        }
        
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          autocompleteInputRef.current,
          options
        );

        autocompleteRef.current.addListener('place_changed', () => {
          if (!autocompleteRef.current) return;
          
          const place = autocompleteRef.current.getPlace();
          console.log('Google Place selected:', place);
          
          const addressData = parseGooglePlaceResult(place);
          if (!addressData) return;

          console.log('Parsed address data:', addressData);
          onAddressChange(addressData);
        });
      } catch (error) {
        console.error('Error initializing Google Places Autocomplete:', error);
        toast.error('Failed to initialize address autocomplete');
      }
    }
  }, [googleLoaded, onAddressChange, userLocation]);

  return {
    autocompleteInputRef,
    isLoadingScript,
    googleLoaded,
    userLocation
  };
};
