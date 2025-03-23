
import React, { useState } from 'react';
import { toast } from 'sonner';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileLoadingState from '@/components/profile/ProfileLoadingState';
import ProfileForm from '@/components/profile/ProfileForm';

const Profile: React.FC = () => {
  const { profile, updateProfile, isLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  console.log('Profile page rendering with profile data:', profile);

  const handleSubmit = async (formData: any) => {
    setIsSaving(true);
    
    try {
      console.log('Submitting profile update with data:', formData);
      
      // Filter out email as it can't be updated through profile
      const { email, ...updateData } = formData;
      
      console.log('Calling updateProfile with:', updateData);
      await updateProfile(updateData);
      
      // Stay on profile page but show success message
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <Navbar />
        <ProfileLoadingState />
        <Footer />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <ProfileHeader title="Profile Settings" />
          
          <ProfileForm 
            onSubmit={handleSubmit} 
            isSaving={isSaving} 
          />
        </div>
      </div>
      
      <Footer />
    </PageWrapper>
  );
};

export default Profile;
