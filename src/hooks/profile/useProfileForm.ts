import { useState } from 'react';
import { useProfileData } from './useProfileData';
import { useParentData } from './useParentData';
import { useProfileSubmit } from './useProfileSubmit';
import { getInitials } from './useProfileUtilities';
import { useAuth } from '@/hooks/auth/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProfileForm = () => {
  const { profile, user } = useAuth();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const {
    formData,
    handleChange,
    handleAddressChange,
    setFormData,
    handleSchoolChange
  } = useProfileData();
  
  const {
    parentData,
    isLoadingParentData,
    handleParentDataChange
  } = useParentData(user?.id, profile?.user_type);
  
  const { isSaving, submitProfile } = useProfileSubmit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitProfile(formData, parentData);
  };

  const handleAvatarChange = async (file: File) => {
    if (!user?.id) {
      toast.error('You must be logged in to upload an avatar');
      return;
    }
    
    try {
      setUploadingAvatar(true);
      
      // Generate a unique file path for the avatar
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}-${Date.now()}.${fileExt}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update the formData with the new avatar URL
      setFormData(prev => ({
        ...prev,
        avatar_url: publicUrl
      }));
      
      toast.success('Avatar uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(`Failed to upload avatar: ${error.message}`);
    } finally {
      setUploadingAvatar(false);
    }
  };

  return {
    formData,
    parentData,
    isSaving,
    isLoadingParentData,
    uploadingAvatar,
    profile,
    user,
    handleChange,
    handleAddressChange,
    handleParentDataChange,
    handleSchoolChange,
    handleSubmit,
    handleAvatarChange,
    getInitials
  };
};
