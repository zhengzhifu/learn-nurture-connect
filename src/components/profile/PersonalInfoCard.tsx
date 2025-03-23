
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PersonalInfoForm from './PersonalInfoForm';
import AddressInfoForm from './AddressInfoForm';

interface PersonalInfoCardProps {
  formData: {
    full_name: string;
    email: string;
    phone: string;
    avatar_url: string;
    home_address: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  getInitials: (name: string) => string;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ 
  formData, 
  handleChange, 
  getInitials 
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
          formData={{ home_address: formData.home_address }} 
          handleChange={handleChange} 
        />
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
