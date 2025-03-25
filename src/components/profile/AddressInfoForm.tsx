
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface AddressInfoFormProps {
  formData: {
    home_address: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AddressInfoForm: React.FC<AddressInfoFormProps> = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Address Information</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Your address helps us find tutors near you and will be used for distance-based matching.
      </p>
      
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="address_line1">Address Line 1</Label>
          <Input 
            id="address_line1" 
            name="address_line1" 
            value={formData.address_line1 || ''}
            onChange={handleChange}
            placeholder="Street address"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
          <Input 
            id="address_line2" 
            name="address_line2" 
            value={formData.address_line2 || ''}
            onChange={handleChange}
            placeholder="Apartment, suite, unit, etc."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input 
              id="city" 
              name="city" 
              value={formData.city || ''}
              onChange={handleChange}
              placeholder="City"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="state">State/Province</Label>
            <Input 
              id="state" 
              name="state" 
              value={formData.state || ''}
              onChange={handleChange}
              placeholder="State or Province"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="zip_code">ZIP/Postal Code</Label>
            <Input 
              id="zip_code" 
              name="zip_code" 
              value={formData.zip_code || ''}
              onChange={handleChange}
              placeholder="ZIP or Postal code"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="country">Country</Label>
            <Input 
              id="country" 
              name="country" 
              value={formData.country || ''}
              onChange={handleChange}
              placeholder="Country"
            />
          </div>
        </div>
        
        <div className="grid gap-2 mt-4">
          <Label htmlFor="home_address">Full Address (Generated)</Label>
          <Textarea 
            id="home_address" 
            name="home_address" 
            value={formData.home_address || ''}
            onChange={handleChange}
            placeholder="Your complete address will appear here"
            rows={3}
            readOnly
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">This field is automatically generated from the fields above.</p>
        </div>
      </div>
    </div>
  );
};

export default AddressInfoForm;
