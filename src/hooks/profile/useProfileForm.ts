
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth/useAuth';

export const useProfileForm = () => {
  const { profile, user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    avatar_url: '',
    school_id: undefined as string | undefined,
    other_school_name: undefined as string | undefined,
    home_address: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });
  
  const [parentData, setParentData] = useState({
    num_children: 0,
    preferred_communication: 'email'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingParentData, setIsLoadingParentData] = useState(false);

  useEffect(() => {
    if (profile) {
      let addressData = {};
      try {
        if (profile.home_address && (
          profile.home_address.startsWith('{') || 
          profile.home_address.includes('"latitude"')
        )) {
          addressData = JSON.parse(profile.home_address);
        }
      } catch (e) {
        console.error('Error parsing address data:', e);
      }
      
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        avatar_url: profile.avatar_url || '',
        school_id: profile.school_id,
        other_school_name: profile.other_school_name,
        home_address: typeof addressData === 'object' && addressData.hasOwnProperty('formatted_address') 
          ? (addressData as any).formatted_address 
          : profile.home_address || '',
        address_line1: typeof addressData === 'object' ? (addressData as any).address_line1 || '' : '',
        address_line2: typeof addressData === 'object' ? (addressData as any).address_line2 || '' : '',
        city: typeof addressData === 'object' ? (addressData as any).city || '' : '',
        state: typeof addressData === 'object' ? (addressData as any).state || '' : '',
        zip_code: typeof addressData === 'object' ? (addressData as any).zip_code || '' : '',
        country: typeof addressData === 'object' ? (addressData as any).country || '' : '',
        latitude: typeof addressData === 'object' ? (addressData as any).latitude : undefined,
        longitude: typeof addressData === 'object' ? (addressData as any).longitude : undefined,
      });
      
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

  const handleAddressChange = (addressData: any) => {
    console.log('Setting address data:', addressData);
    setFormData(prev => ({
      ...prev,
      home_address: addressData.home_address || '',
      address_line1: addressData.address_line1 || '',
      address_line2: addressData.address_line2 || '',
      city: addressData.city || '',
      state: addressData.state || '',
      zip_code: addressData.zip_code || '',
      country: addressData.country || '',
      latitude: addressData.latitude,
      longitude: addressData.longitude
    }));
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
    setIsSaving(true);
    
    try {
      console.log('Submitting profile update with data:', formData);
      
      const addressData = {
        formatted_address: formData.home_address,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        country: formData.country,
        latitude: formData.latitude,
        longitude: formData.longitude
      };
      
      // Filter out email as it can't be updated through profile
      const { email, ...updateData } = formData;
      
      console.log('Calling updateProfile with:', updateData);
      
      // Update profile data with JSON stringified address
      await updateProfile({
        ...updateData,
        home_address: JSON.stringify(addressData)
      });
      
      // If user is a parent, update parent-specific data
      if (profile?.user_type === 'parent' && parentData && profile.id) {
        console.log('Updating parent data:', parentData);
        
        const { error } = await supabase
          .from('parents')
          .upsert({ 
            id: profile.id,
            num_children: parentData.num_children,
            preferred_communication: parentData.preferred_communication
          });
          
        if (error) {
          console.error('Error updating parent data:', error);
          toast.error('Failed to update parent information');
        }
      }
      
      // Stay on profile page but show success message
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
