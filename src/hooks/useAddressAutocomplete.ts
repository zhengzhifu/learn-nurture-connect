import { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsScript, parseGooglePlaceResult } from '@/utils/googleMaps';

export interface AddressData {
  home_address?: string;
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
  initialAddress?: AddressData;
  onAddressChange?: (addressData: AddressData) => void;
  preventFormSubmission?: boolean;
}

export const useAddressAutocomplete = ({ 
  initialAddress, 
  onAddressChange,
  preventFormSubmission = false
}: UseAddressAutocompleteProps = {}) => {
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const [isLoadingScript, setIsLoadingScript] = useState(true);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  
  useEffect(() => {
    loadGoogleMapsScript(() => {
      setIsLoadingScript(false);
      setGoogleLoaded(true);
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.log("Error getting user location:", error);
          }
        );
      }
    });
  }, []);
  
  useEffect(() => {
    if (!googleLoaded || !autocompleteInputRef.current) return;
    
    try {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteInputRef.current,
        { types: ['address'] }
      );
      
      if (userLocation) {
        const circle = new window.google.maps.Circle({
          center: userLocation,
          radius: 50000
        });
        autocomplete.setBounds(circle.getBounds() as google.maps.LatLngBounds);
      }
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          const parsedAddress = parseGooglePlaceResult(place);
          
          if (parsedAddress && onAddressChange) {
            onAddressChange(parsedAddress);
          }
          
          if (preventFormSubmission) {
            setTimeout(() => {
              if (document.activeElement === autocompleteInputRef.current) {
                autocompleteInputRef.current?.blur();
              }
            }, 0);
          }
        }
      });
      
      if (initialAddress && initialAddress.home_address) {
        autocompleteInputRef.current.value = initialAddress.home_address;
      }
    } catch (error) {
      console.error('Error setting up Google Places Autocomplete:', error);
    }
  }, [googleLoaded, userLocation, initialAddress, onAddressChange, preventFormSubmission]);
  
  return {
    autocompleteInputRef,
    isLoadingScript,
    googleLoaded,
    userLocation
  };
};
