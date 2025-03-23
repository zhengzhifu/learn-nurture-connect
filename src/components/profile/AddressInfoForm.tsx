
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddressInfoFormProps {
  formData: {
    home_address: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AddressInfoForm: React.FC<AddressInfoFormProps> = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Address Information</h3>
      
      <div className="grid gap-2">
        <Label htmlFor="home_address">Home Address</Label>
        <Textarea 
          id="home_address" 
          name="home_address" 
          value={formData.home_address || ''}
          onChange={handleChange}
          placeholder="Enter your home address"
          rows={3}
        />
      </div>
    </div>
  );
};

export default AddressInfoForm;
