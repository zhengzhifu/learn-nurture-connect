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
export const parseGooglePlaceResult = (place: google.maps.places.PlaceResult): any => {
  if (!place.geometry || !place.geometry.location) {
    console.error('No geometry information available for this place');
    return null;
  }

  // Get latitude and longitude
  const latitude = place.geometry.location.lat();
  const longitude = place.geometry.location.lng();
  
  // Initialize the address components
  const addressComponents: Record<string, string> = {
    street_number: '',
    route: '',
    locality: '',
    administrative_area_level_1: '',
    postal_code: '',
    country: ''
  };
  
  // Extract address components
  if (place.address_components) {
    for (const component of place.address_components) {
      const type = component.types[0];
      if (addressComponents.hasOwnProperty(type)) {
        addressComponents[type] = component.long_name;
      }
    }
  }
  
  // Construct address data
  return {
    home_address: place.formatted_address || '',
    address_line1: `${addressComponents.street_number} ${addressComponents.route}`.trim(),
    address_line2: '',
    city: addressComponents.locality,
    state: addressComponents.administrative_area_level_1,
    zip_code: addressComponents.postal_code,
    country: addressComponents.country,
    latitude,
    longitude
  };
};
