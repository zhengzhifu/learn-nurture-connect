
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';

export const useProfileData = () => {
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
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });

  useEffect(() => {
    if (profile) {
      let addressData = {};
      try {
        if (profile.home_address && (
          profile.home_address.startsWith('{') || 
          profile.home_address.includes('"formatted_address"')
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
        // Use the dedicated latitude and longitude columns
        latitude: profile.latitude !== undefined ? profile.latitude : 
                 (typeof addressData === 'object' ? (addressData as any).latitude : undefined),
        longitude: profile.longitude !== undefined ? profile.longitude : 
                  (typeof addressData === 'object' ? (addressData as any).longitude : undefined),
      });
    }
  }, [profile, user]);

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

  const handleSchoolChange = (schoolId: string | undefined, otherSchoolName: string | undefined) => {
    setFormData(prev => ({ 
      ...prev, 
      school_id: schoolId,
      other_school_name: otherSchoolName
    }));
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleAddressChange,
    handleSchoolChange
  };
};
