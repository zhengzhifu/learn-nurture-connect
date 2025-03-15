
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Save, Loader2, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui-custom/Button';
import { useAuth } from '@/hooks/useAuth';

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
        <div className="container mx-auto px-4 py-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Loading Profile...</h2>
            <p className="text-muted-foreground">Please wait while we fetch your profile information.</p>
          </div>
        </div>
        <Footer />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mr-4"
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
          </div>
          
          <form onSubmit={handleSubmit}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Address Information</h3>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="home_address">Home Address</Label>
                      <Textarea 
                        id="home_address" 
                        name="home_address" 
                        value={formData.home_address || ''}
                        onChange={handleChange}
                        placeholder="Enter your home address"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="school_name">School Name</Label>
                      <Input 
                        id="school_name" 
                        name="school_name" 
                        value={formData.school_name || ''}
                        onChange={handleChange}
                        placeholder="Enter your school name"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="school_address">School Address</Label>
                      <Textarea 
                        id="school_address" 
                        name="school_address" 
                        value={formData.school_address || ''}
                        onChange={handleChange}
                        placeholder="Enter your school address"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  icon={isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
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
