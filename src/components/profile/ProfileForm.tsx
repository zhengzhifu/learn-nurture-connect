
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { Card, CardFooter } from "@/components/ui/card";
import ApprovalStatusAlert from './ApprovalStatusAlert';
import PersonalInfoCard from './PersonalInfoCard';
import SchoolInfoSection from './SchoolInfoSection';
import TutorServiceDetails from './TutorServiceDetails';
import ProfileFormActions from './ProfileFormActions';

interface ProfileFormProps {
  onSubmit: (formData: any) => Promise<void>;
  isSaving: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, isSaving }) => {
  const { profile, user } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    avatar_url: '',
    school_id: undefined as string | undefined,
    other_school_name: undefined as string | undefined,
    home_address: '',
    child_school_id: undefined as string | undefined
  });

  // Initialize form data from profile when it becomes available
  useEffect(() => {
    if (profile) {
      // Create form data from profile
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        avatar_url: profile.avatar_url || '',
        school_id: profile.school_id,
        other_school_name: profile.other_school_name,
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

  return (
    <form onSubmit={handleSubmit}>
      <ApprovalStatusAlert status={profile?.approval_status} />
      
      <PersonalInfoCard 
        formData={formData} 
        handleChange={handleChange} 
        getInitials={getInitials} 
      />

      <SchoolInfoSection 
        userType={profile?.user_type}
        schoolId={formData.school_id}
        otherSchoolName={formData.other_school_name}
        childSchoolId={formData.child_school_id}
        onSchoolChange={handleSchoolChange}
        onChildSchoolChange={handleChildSchoolChange}
      />

      {profile?.user_type === 'tutor' && user?.id && (
        <TutorServiceDetails 
          userId={user.id} 
          userType={profile.user_type === 'tutor' ? 'tutor' : 'parent'} 
        />
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
