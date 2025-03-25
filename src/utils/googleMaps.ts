
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Declare global google namespace to fix TypeScript errors
declare global {
  interface Window {
    google: typeof google;
  }
}

/**
 * Loads the Google Maps API script with the API key from Supabase
 * @param callback Function to call when the script has loaded
 */
export const loadGoogleMapsScript = async (callback: () => void): Promise<void> => {
  const existingScript = document.getElementById('google-maps-api');
  if (existingScript) {
    if (callback) callback();
    return;
  }

  try {
    // Fetch the API key from our edge function
    const response = await supabase.functions.invoke('get-google-maps-key');
    
    if (response.error) {
      console.error('Error fetching Google Maps API key:', response.error);
      toast.error('Failed to load address autocomplete service');
      return;
    }
    
    const { data } = response;
    const apiKey = data?.apiKey;
    
    if (!apiKey) {
      console.error('No API key returned from the server');
      toast.error('Failed to load address autocomplete service');
      return;
    }
    
    const script = document.createElement('script');
    script.id = 'google-maps-api';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = callback;
    document.head.appendChild(script);
  } catch (error) {
    console.error('Error loading Google Maps script:', error);
    toast.error('Failed to load address autocomplete service');
  }
};

/**
 * Parses the address components from a Google Place result
 * @param place Google Place result
 * @returns Parsed address data
 */
export const parseGooglePlaceResult = (place: google.maps.places.PlaceResult) => {
  if (!place.geometry) {
    toast.warning('No address details available for this selection');
    return null;
  }

  const addressComponents = place.address_components || [];
  const formattedAddress = place.formatted_address || '';
  const lat = place.geometry.location?.lat();
  const lng = place.geometry.location?.lng();

  // Extract address components
  let streetNumber = '';
  let route = '';
  let city = '';
  let state = '';
  let zipCode = '';
  let country = '';

  addressComponents.forEach(component => {
    const types = component.types;
    
    if (types.includes('street_number')) {
      streetNumber = component.long_name;
    } else if (types.includes('route')) {
      route = component.long_name;
    } else if (types.includes('locality')) {
      city = component.long_name;
    } else if (types.includes('administrative_area_level_1')) {
      state = component.short_name;
    } else if (types.includes('postal_code')) {
      zipCode = component.long_name;
    } else if (types.includes('country')) {
      country = component.long_name;
    }
  });

  // Create address line 1 (street number + route)
  const addressLine1 = `${streetNumber} ${route}`.trim();

  // Create address data object
  return {
    home_address: formattedAddress,
    address_line1: addressLine1,
    address_line2: '',
    city,
    state,
    zip_code: zipCode,
    country,
    latitude: lat,
    longitude: lng
  };
};
