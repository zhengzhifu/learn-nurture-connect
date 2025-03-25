
import React from 'react';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/auth/useAuth';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileLoadingState from '@/components/profile/ProfileLoadingState';
import ProfileForm from '@/components/profile/ProfileForm';

const Profile: React.FC = () => {
  const { profile, isLoading } = useAuth();

  console.log('Profile page rendering with profile data:', profile);

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
          
          <ProfileForm />
        </div>
      </div>
      
      <Footer />
    </PageWrapper>
  );
};

export default Profile;
