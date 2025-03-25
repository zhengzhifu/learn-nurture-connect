
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth/useAuth';

export const useProfileSubmit = () => {
  const { profile, user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const submitProfile = async (
    formData: any, 
    parentData: any
  ) => {
    setIsSaving(true);
    
    try {
      console.log('Submitting profile update with data:', formData);
      
      // Create a JSON string with all address details
      const addressData = {
        formatted_address: formData.home_address,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        country: formData.country,
        latitude: formData.latitude,
        longitude: formData.longitude
      };
      
      // Filter out email as it can't be updated through profile
      // Also remove all the individual address fields that don't exist in the database
      const { 
        email, 
        address_line1, 
        address_line2, 
        city, 
        state, 
        zip_code, 
        country, 
        latitude, 
        longitude,
        ...updateData 
      } = formData;
      
      console.log('Calling updateProfile with:', updateData);
      
      // Update profile data with JSON stringified address
      await updateProfile({
        ...updateData,
        home_address: JSON.stringify(addressData)
      });
      
      // If user is a parent, update parent-specific data
      if (profile?.user_type === 'parent' && parentData && profile.id) {
        console.log('Updating parent data:', parentData);
        
        const { error } = await supabase
          .from('parents')
          .upsert({ 
            id: profile.id,
            num_children: parentData.num_children,
            preferred_communication: parentData.preferred_communication
          });
          
        if (error) {
          console.error('Error updating parent data:', error);
          toast.error('Failed to update parent information');
        }
      }
      
      // Stay on profile page but show success message
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    submitProfile
  };
};
