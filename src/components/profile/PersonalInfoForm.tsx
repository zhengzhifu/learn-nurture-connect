
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PersonalInfoFormProps {
  formData: {
    full_name: string;
    email: string;
    phone: string;
    avatar_url: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  getInitials: (name: string) => string;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ 
  formData, 
  handleChange, 
  getInitials 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
      <div className="mb-4 sm:mb-0">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={formData.avatar_url || ''} alt={formData.full_name} />
            <AvatarFallback>{getInitials(formData.full_name || 'User')}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <div className="flex-1 space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input 
            id="full_name" 
            name="full_name" 
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            value={formData.email}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            name="phone" 
            value={formData.phone || ''}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
