
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { Card, CardFooter } from "@/components/ui/card";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ApprovalStatusAlert from './ApprovalStatusAlert';
import PersonalInfoCard from './PersonalInfoCard';
import SchoolInfoSection from './SchoolInfoSection';
import TutorServiceDetails from './TutorServiceDetails';
import ParentInfoForm from './ParentInfoForm';
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
  });
  
  const [parentData, setParentData] = useState({
    num_children: 0,
    preferred_communication: 'email'
  });
  
  const [isLoadingParentData, setIsLoadingParentData] = useState(false);

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
      });
      
      // Fetch parent data if user is a parent
      if (profile.user_type === 'parent' && user?.id) {
        fetchParentData(user.id);
      }
    }
  }, [profile, user]);
  
  const fetchParentData = async (userId: string) => {
    setIsLoadingParentData(true);
    try {
      const { data, error } = await supabase
        .from('parents')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching parent data:', error);
        toast.error('Failed to load parent information');
      } else if (data) {
        setParentData({
          num_children: data.num_children || 0,
          preferred_communication: data.preferred_communication || 'email'
        });
      }
    } catch (error) {
      console.error('Exception fetching parent data:', error);
    } finally {
      setIsLoadingParentData(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleParentDataChange = (field: string, value: string | number) => {
    setParentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSchoolChange = (schoolId: string | undefined, otherSchoolName: string | undefined) => {
    setFormData(prev => ({ 
      ...prev, 
      school_id: schoolId,
      other_school_name: otherSchoolName
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine profile and parent data if user is a parent
    const combinedData = {
      ...formData,
      ...(profile?.user_type === 'parent' && {
        parentData: parentData
      })
    };
    
    await onSubmit(combinedData);
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
        onSchoolChange={handleSchoolChange}
      />
      
      {profile?.user_type === 'parent' && !isLoadingParentData && (
        <ParentInfoForm 
          numChildren={parentData.num_children}
          preferredCommunication={parentData.preferred_communication}
          handleParentDataChange={handleParentDataChange}
        />
      )}

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
