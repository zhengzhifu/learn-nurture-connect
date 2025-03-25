
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PersonalInfoForm from './PersonalInfoForm';
import AddressInfoForm from './AddressInfoForm';

interface PersonalInfoCardProps {
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar_url: string;
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
  getInitials: (name: string) => string;
  handleAddressChange?: (addressData: any) => void;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ 
  formData, 
  handleChange, 
  getInitials,
  handleAddressChange
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details and contact information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PersonalInfoForm 
          formData={formData} 
          handleChange={handleChange} 
          getInitials={getInitials} 
        />
        
        <Separator />
        
        <AddressInfoForm 
          formData={formData} 
          handleChange={handleChange}
          handleAddressChange={handleAddressChange} 
        />
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
