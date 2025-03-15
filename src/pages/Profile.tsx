
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/hooks/useAuth';

// Import refactored components
import ProfileHeader from '@/components/profile/ProfileHeader';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import AddressInfoForm from '@/components/profile/AddressInfoForm';
import ProfileFormActions from '@/components/profile/ProfileFormActions';
import ProfileLoadingState from '@/components/profile/ProfileLoadingState';

const Profile: React.FC = () => {
  const { profile, user, updateProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    avatar_url: '',
    school_name: '',
    school_address: '',
    home_address: '',
  });

  // Initialize form data from profile when it becomes available
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        avatar_url: profile.avatar_url || '',
        school_name: profile.school_name || '',
        school_address: profile.school_address || '',
        home_address: profile.home_address || '',
      });
    }
  }, [profile, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Filter out email as it can't be updated through profile
      const { email, ...updateData } = formData;
      
      await updateProfile(updateData);
      toast.success('Profile updated successfully');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
          
          <form onSubmit={handleSubmit}>
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
                />
              </CardContent>
              <CardFooter>
                <ProfileFormActions isSaving={isSaving} />
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
      
      <Footer />
    </PageWrapper>
  );
};

export default Profile;
