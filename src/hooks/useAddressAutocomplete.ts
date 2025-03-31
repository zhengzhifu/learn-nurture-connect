
import { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsScript, parseGooglePlaceResult } from '@/utils/googleMaps';

interface AddressData {
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
  
  // Initialize Google Maps script
  useEffect(() => {
    loadGoogleMapsScript(() => {
      setIsLoadingScript(false);
      setGoogleLoaded(true);
      
      // Try to get user's location for better autocomplete results
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
  
  // Initialize autocomplete when Google Maps is loaded
  useEffect(() => {
    if (!googleLoaded || !autocompleteInputRef.current) return;
    
    try {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteInputRef.current,
        { types: ['address'] }
      );
      
      // Bias the autocomplete results to the user's location if available
      if (userLocation) {
        const circle = new window.google.maps.Circle({
          center: userLocation,
          radius: 50000 // 50km radius
        });
        autocomplete.setBounds(circle.getBounds() as google.maps.LatLngBounds);
      }
      
      // Set up the place_changed event listener
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          const parsedAddress = parseGooglePlaceResult(place);
          
          if (parsedAddress && onAddressChange) {
            onAddressChange(parsedAddress);
          }
          
          // Prevent form submission when selecting from dropdown
          if (preventFormSubmission) {
            setTimeout(() => {
              // This prevents the enter key from submitting the form
              if (document.activeElement === autocompleteInputRef.current) {
                autocompleteInputRef.current?.blur();
              }
            }, 0);
          }
        }
      });
      
      // Fill in the input field with the initial address if provided
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

