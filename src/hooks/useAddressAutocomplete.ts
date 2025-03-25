
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
}

export const useAddressAutocomplete = ({ 
  initialAddress, 
  onAddressChange 
}: UseAddressAutocompleteProps) => {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [isLoadingScript, setIsLoadingScript] = useState(false);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

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
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          autocompleteInputRef.current,
          { types: ['address'] }
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
  }, [googleLoaded, onAddressChange]);

  return {
    autocompleteInputRef,
    isLoadingScript,
    googleLoaded
  };
};
