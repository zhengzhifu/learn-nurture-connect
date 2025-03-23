
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ApprovalStatus, UserRole } from '@/types/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PersonalInfoForm from './PersonalInfoForm';
import AddressInfoForm from './AddressInfoForm';
import SchoolSelector from './SchoolSelector';
import AvailabilityManager from './AvailabilityManager';
import SpecialtyManager from './SpecialtyManager';
import ProfileFormActions from './ProfileFormActions';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ProfileFormProps {
  onSubmit: (formData: any) => Promise<void>;
  isSaving: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, isSaving }) => {
  const { profile, user } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    avatar_url: '',
    school_id: undefined as string | undefined,
    other_school_name: undefined as string | undefined,
    school_name: '',
    school_address: '',
    home_address: '',
    child_school_id: undefined as string | undefined
  });

  // Initialize form data from profile when it becomes available
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        avatar_url: profile.avatar_url || '',
        school_id: profile.school_id,
        other_school_name: profile.other_school_name,
        school_name: profile.school_name || '',
        school_address: profile.school_address || '',
        home_address: profile.home_address || '',
        child_school_id: profile.child_school_id
      });
    }
  }, [profile, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSchoolChange = (schoolId: string | undefined, otherSchoolName: string | undefined) => {
    setFormData(prev => ({ 
      ...prev, 
      school_id: schoolId,
      other_school_name: otherSchoolName
    }));
  };

  const handleChildSchoolChange = (schoolId: string | undefined, otherSchoolName: string | undefined) => {
    setFormData(prev => ({ 
      ...prev, 
      child_school_id: schoolId,
      // We're not storing 'other child school' in this implementation
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  // Helper to get initials from name
  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const renderApprovalStatusAlert = () => {
    if (!profile?.approval_status) return null;
    
    switch (profile.approval_status as ApprovalStatus) {
      case 'pending':
        return (
          <Alert variant="warning" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Profile Pending Approval</AlertTitle>
            <AlertDescription>
              Your profile is currently under review. Once approved, you'll be able to access all platform features.
            </AlertDescription>
          </Alert>
        );
      case 'rejected':
        return (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Profile Approval Rejected</AlertTitle>
            <AlertDescription>
              Your profile has been rejected. Please update your information and try again.
            </AlertDescription>
          </Alert>
        );
      case 'approved':
        return (
          <Alert variant="default" className="mb-6 bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Profile Approved</AlertTitle>
            <AlertDescription className="text-green-700">
              Your profile has been approved! You can now use all platform features.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderApprovalStatusAlert()}
      
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
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>School Information</CardTitle>
          <CardDescription>Select your school or add a new one</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {profile?.user_type === 'tutor' && (
            <SchoolSelector
              selectedSchoolId={formData.school_id}
              otherSchoolName={formData.other_school_name}
              onSchoolChange={handleSchoolChange}
              label="Your School"
            />
          )}
          
          {profile?.user_type === 'parent' && (
            <SchoolSelector
              selectedSchoolId={formData.child_school_id}
              otherSchoolName={undefined}
              onSchoolChange={handleChildSchoolChange}
              label="Child's School"
            />
          )}
        </CardContent>
      </Card>

      {profile?.user_type === 'tutor' && user?.id && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>Manage your availability and specialties</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <AvailabilityManager userId={user.id} />
            
            <Separator />
            
            <SpecialtyManager userId={user.id} userType={profile.user_type as UserRole} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardFooter>
          <ProfileFormActions isSaving={isSaving} />
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProfileForm;
