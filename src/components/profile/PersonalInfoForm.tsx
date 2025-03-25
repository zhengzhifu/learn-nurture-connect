
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PersonalInfoFormProps {
  formData: {
    first_name: string;
    last_name: string;
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
  // Generate a display name for the avatar
  const displayName = `${formData.first_name} ${formData.last_name}`.trim() || 'User';
  
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
      <div className="mb-4 sm:mb-0">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={formData.avatar_url || ''} alt={displayName} />
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <div className="flex-1 space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input 
            id="first_name" 
            name="first_name" 
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Enter your first name"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input 
            id="last_name" 
            name="last_name" 
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Enter your last name"
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
