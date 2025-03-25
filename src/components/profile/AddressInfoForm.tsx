
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAddressAutocomplete, AddressData } from '@/hooks/useAddressAutocomplete';

interface AddressInfoFormProps {
  formData: AddressData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAddressChange?: (addressData: AddressData) => void;
}

const AddressInfoForm: React.FC<AddressInfoFormProps> = ({ 
  formData, 
  handleChange,
  handleAddressChange 
}) => {
  const onAddressChange = (addressData: AddressData) => {
    if (handleAddressChange) {
      handleAddressChange(addressData);
    } else {
      // Create a fake event to update the home_address field
      const event = {
        target: {
          name: 'home_address',
          value: addressData.home_address
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleChange(event);
    }
  };
  
  const { autocompleteInputRef, isLoadingScript } = useAddressAutocomplete({
    initialAddress: formData,
    onAddressChange
  });

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
            placeholder={isLoadingScript ? "Loading address service..." : "Start typing your address for suggestions"}
            className="w-full"
            disabled={isLoadingScript}
          />
          <p className="text-xs text-muted-foreground">
            {isLoadingScript 
              ? "Loading address autocomplete service..."
              : "Start typing to see address suggestions"}
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
