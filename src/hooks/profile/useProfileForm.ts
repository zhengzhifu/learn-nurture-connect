
import { useProfileData } from './useProfileData';
import { useParentData } from './useParentData';
import { useProfileSubmit } from './useProfileSubmit';
import { getInitials } from './useProfileUtilities';
import { useAuth } from '@/hooks/auth/useAuth';

export const useProfileForm = () => {
  const { profile, user } = useAuth();
  
  const {
    formData,
    handleChange,
    handleAddressChange,
    handleSchoolChange: handleProfileDataSchoolChange
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

  const handleSchoolChange = (schoolId: string | undefined, otherSchoolName: string | undefined, isChanged: boolean) => {
    console.log('School changed in form:', isChanged);
    handleProfileDataSchoolChange(schoolId, otherSchoolName, isChanged);
  };

  return {
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
  };
};
