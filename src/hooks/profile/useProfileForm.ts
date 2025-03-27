
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
      
      // Create the avatars bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
      
      if (!avatarBucketExists) {
        console.log('Creating avatars bucket...');
        await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2, // 2MB
        });
      }
      
      // Generate a unique file path for the avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}`;
      const filePath = `${fileName}.${fileExt}`;
      
      console.log('Uploading avatar to path:', filePath);
      
      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        throw uploadError;
      }
      
      console.log('Upload successful:', uploadData);
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      console.log('Avatar public URL:', publicUrl);
      
      // Update the formData with the new avatar URL
      setFormData(prev => ({
        ...prev,
        avatar_url: publicUrl
      }));
      
      // Also update the profile in the database immediately
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
        
      if (updateError) {
        console.error('Error updating profile with avatar URL:', updateError);
        throw updateError;
      }
      
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
