
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
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
  });
  
  const [parentData, setParentData] = useState({
    num_children: 0,
    preferred_communication: 'email'
  });
  
  const [isLoadingParentData, setIsLoadingParentData] = useState(false);

  // Initialize form data from profile when it becomes available
  useEffect(() => {
    if (profile) {
      // Parse existing home_address into components if possible
      const addressParts = parseExistingAddress(profile.home_address || '');
      
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
        address_line1: addressParts.address_line1 || '',
        address_line2: addressParts.address_line2 || '',
        city: addressParts.city || '',
        state: addressParts.state || '',
        zip_code: addressParts.zip_code || '',
        country: addressParts.country || '',
      });
      
      // Fetch parent data if user is a parent
      if (profile.user_type === 'parent' && user?.id) {
        fetchParentData(user.id);
      }
    }
  }, [profile, user]);
  
  // Function to attempt parsing an existing address string into components
  const parseExistingAddress = (address: string): Partial<typeof formData> => {
    if (!address) return {};
    
    try {
      // Simple heuristic parsing - this is a best-effort approach
      const parts: Partial<typeof formData> = {};
      
      // Check if address might be in JSON format (previously stored structured data)
      if (address.startsWith('{') && address.endsWith('}')) {
        try {
          const parsed = JSON.parse(address);
          return parsed;
        } catch {
          // Not valid JSON, continue with string parsing
        }
      }
      
      // Split by commas and try to identify parts
      const segments = address.split(',').map(s => s.trim());
      
      if (segments.length >= 1) parts.address_line1 = segments[0];
      if (segments.length >= 3) {
        parts.city = segments[segments.length - 3];
        
        // Try to parse state and zip
        const stateZip = segments[segments.length - 2].split(' ');
        if (stateZip.length > 0) parts.state = stateZip[0];
        if (stateZip.length > 1) parts.zip_code = stateZip.slice(1).join(' ');
        
        parts.country = segments[segments.length - 1];
      }
      
      return parts;
    } catch (error) {
      console.error('Error parsing address:', error);
      return {};
    }
  };
  
  // Effect to update the full address when individual fields change
  useEffect(() => {
    const { address_line1, address_line2, city, state, zip_code, country } = formData;
    
    // Build the full address from components
    const addressParts = [];
    if (address_line1) addressParts.push(address_line1);
    if (address_line2) addressParts.push(address_line2);
    if (city) addressParts.push(city);
    
    let stateZip = '';
    if (state) stateZip += state;
    if (zip_code) stateZip += ' ' + zip_code;
    if (stateZip.trim()) addressParts.push(stateZip.trim());
    
    if (country) addressParts.push(country);
    
    const fullAddress = addressParts.join(', ');
    
    // Update the home_address field with the composed address
    if (fullAddress !== formData.home_address) {
      setFormData(prev => ({ ...prev, home_address: fullAddress }));
    }
  }, [formData.address_line1, formData.address_line2, formData.city, formData.state, formData.zip_code, formData.country]);
  
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
    
    // Store the address components in home_address as a JSON string for future geocoding
    const addressData = {
      address_line1: formData.address_line1,
      address_line2: formData.address_line2,
      city: formData.city,
      state: formData.state,
      zip_code: formData.zip_code,
      country: formData.country
    };
    
    // Combine profile and parent data if user is a parent
    const combinedData = {
      ...formData,
      // Include address data for future processing
      address_data: JSON.stringify(addressData),
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
