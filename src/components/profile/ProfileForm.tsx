
import React from 'react';
import { useProfileForm } from '@/hooks/profile/useProfileForm';
import ApprovalStatusAlert from './ApprovalStatusAlert';
import PersonalInfoCard from './PersonalInfoCard';
import SchoolInfoSection from './SchoolInfoSection';
import TutorServiceDetails from './TutorServiceDetails';
import ParentInfoForm from './ParentInfoForm';
import ProfileFormActions from './ProfileFormActions';
import { Card, CardFooter } from "@/components/ui/card";

const ProfileForm: React.FC = () => {
  const {
    formData,
    parentData,
    isSaving,
    isLoadingParentData,
    profile,
    user,
    handleChange,
    handleAddressChange,
    handleParentDataChange,
    handleSchoolChange,
    handleSubmit,
    getInitials
  } = useProfileForm();

  return (
    <form onSubmit={handleSubmit}>
      <ApprovalStatusAlert status={profile?.approval_status} />
      
      <PersonalInfoCard 
        formData={formData} 
        handleChange={handleChange} 
        getInitials={getInitials} 
        handleAddressChange={handleAddressChange}
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
