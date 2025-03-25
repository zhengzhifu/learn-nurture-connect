import React, { useEffect, useRef, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';

// Declare global google namespace to fix TypeScript errors
declare global {
  interface Window {
    google: typeof google;
  }
}

// Add Google Maps Places API script dynamically
const loadGoogleMapsScript = (callback: () => void) => {
  const existingScript = document.getElementById('google-maps-api');
  if (!existingScript) {
    const script = document.createElement('script');
    script.id = 'google-maps-api';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places';
    script.async = true;
    script.defer = true;
    script.onload = callback;
    document.head.appendChild(script);
  } else if (callback) {
    callback();
  }
};

interface AddressInfoFormProps {
  formData: {
    home_address: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAddressChange?: (addressData: any) => void;
}

const AddressInfoForm: React.FC<AddressInfoFormProps> = ({ 
  formData, 
  handleChange,
  handleAddressChange 
}) => {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      setGoogleLoaded(true);
    });
  }, []);

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
          
          if (!place.geometry) {
            toast.warning('No address details available for this selection');
            return;
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
          const addressData = {
            home_address: formattedAddress,
            address_line1: addressLine1,
            city,
            state,
            zip_code: zipCode,
            country,
            latitude: lat,
            longitude: lng
          };

          console.log('Parsed address data:', addressData);

          // Update the form with the new address data
          if (handleAddressChange) {
            handleAddressChange(addressData);
          } else {
            // Create a fake event to update the home_address field
            const event = {
              target: {
                name: 'home_address',
                value: formattedAddress
              }
            } as React.ChangeEvent<HTMLInputElement>;
            
            handleChange(event);
          }
        });
      } catch (error) {
        console.error('Error initializing Google Places Autocomplete:', error);
        toast.error('Failed to initialize address autocomplete');
      }
    }
  }, [googleLoaded, handleChange, handleAddressChange]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Address Information</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Your address helps us find tutors near you and will be used for distance-based matching.
      </p>
      
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="autocomplete_address">Enter your address</Label>
          <Input 
            id="autocomplete_address" 
            name="autocomplete_address"
            ref={autocompleteInputRef}
            placeholder="Start typing your address for suggestions"
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Start typing to see address suggestions
          </p>
        </div>
        
        <div className="grid gap-2 mt-4">
          <Label htmlFor="home_address">Complete Address</Label>
          <Textarea 
            id="home_address" 
            name="home_address" 
            value={formData.home_address || ''}
            onChange={handleChange}
            rows={2}
            readOnly
            className="bg-muted"
          />
          <div className="flex gap-2 items-start text-xs text-muted-foreground">
            <p className="flex-1">This address will be used for matching you with tutors in your area.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInfoForm;
