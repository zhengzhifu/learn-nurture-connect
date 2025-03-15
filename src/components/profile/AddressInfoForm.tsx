
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AddressInfoFormProps {
  formData: {
    home_address: string;
    school_name: string;
    school_address: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AddressInfoForm: React.FC<AddressInfoFormProps> = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Address Information</h3>
      
      <div className="grid gap-4">
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
        
        <div className="grid gap-2">
          <Label htmlFor="school_name">School Name</Label>
          <Input 
            id="school_name" 
            name="school_name" 
            value={formData.school_name || ''}
            onChange={handleChange}
            placeholder="Enter your school name"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="school_address">School Address</Label>
          <Textarea 
            id="school_address" 
            name="school_address" 
            value={formData.school_address || ''}
            onChange={handleChange}
            placeholder="Enter your school address"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressInfoForm;
