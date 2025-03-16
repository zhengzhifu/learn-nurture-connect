
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { ServiceClientFactory } from '../api/serviceClientFactory';
import { realServiceClient } from '../api/realServiceClient';

// Fetch user profile data using the service client
export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('ProfileService: Fetching profile for user:', userId);
    
    // Use the service client to fetch the profile
    const client = ServiceClientFactory.getClient();
    console.log('ProfileService: Using client type:', client === realServiceClient ? 'realServiceClient' : 'other');
    
    try {
      const profile = await client.fetchUserProfile(userId);
      
      if (profile) {
        console.log('ProfileService: Profile data fetched successfully:', profile);
        return profile;
      }
    } catch (serviceError) {
      console.error('ProfileService: Error fetching profile via service client:', serviceError);
    }
    
    console.log('ProfileService: No profile found or error occurred, trying direct query');
    
    // Try direct Supabase query as fallback
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, user_type, avatar_url, verified, phone, school_name, school_address, home_address')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('ProfileService: Error in fallback profile fetch:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return null;
    }

    if (!data) {
      console.log('ProfileService: No profile found in fallback query, will create one on demand');
      return null;
    }

    console.log('ProfileService: Profile data fetched from fallback:', data);
    return data as Profile;
  } catch (error: any) {
    console.error('ProfileService: Exception fetching profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, data: Partial<Profile>): Promise<Profile | null> => {
  try {
    if (!userId) throw new Error('No user logged in');
    
    console.log('ProfileService: Updating profile for user:', userId, 'with data:', data);
    console.log('ProfileService: Is user authenticated?', (await supabase.auth.getUser()).data?.user ? 'Yes' : 'No');
    
    // Try direct Supabase operation first for reliability
    console.log('ProfileService: Trying direct Supabase operation first');
    
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking if profile exists:', checkError);
      console.error('Error details:', checkError);
      throw new Error(`Failed to verify profile existence: ${checkError.message}`);
    }
    
    // Get current user for metadata
    const userDetails = await supabase.auth.getUser();
    const userData = userDetails.data.user;
    
    if (!userData) {
      throw new Error('No authenticated user found');
    }
    
    if (!existingProfile) {
      console.log('Profile does not exist, creating a new one via direct API');
      
      // Prepare complete profile data
      const profileData = {
        id: userId,
        full_name: data.full_name || userData.user_metadata?.full_name || 'User',
        email: userData.email || '',
        user_type: data.user_type || userData.user_metadata?.role || 'parent',
        phone: data.phone || '',
        avatar_url: data.avatar_url || '',
        school_name: data.school_name || '',
        school_address: data.school_address || '',
        home_address: data.home_address || '',
        verified: false
      };
      
      console.log('ProfileService: Creating profile with data:', profileData);
      
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select('id, full_name, email, user_type, avatar_url, verified, phone, school_name, school_address, home_address')
        .single();
        
      if (insertError) {
        console.error('Error creating new profile directly:', insertError);
        console.error('Error details:', insertError);
        throw insertError;
      }
      
      console.log('ProfileService: Created new profile directly:', newProfile);
      toast.success('Profile created successfully');
      return newProfile as Profile;
    }
    
    // Update existing profile
    console.log('ProfileService: Updating existing profile with data:', data);
    const { data: directUpdateData, error: directError } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId)
      .select('id, full_name, email, user_type, avatar_url, verified, phone, school_name, school_address, home_address')
      .single();
    
    if (directError) {
      console.error('ProfileService: Direct Supabase update failed:', directError);
      console.error('Error code:', directError.code);
      console.error('Error message:', directError.message);
      console.error('Error details:', directError.details);
      
      // Try the service client as fallback
      console.log('ProfileService: Trying service client as fallback');
      const client = ServiceClientFactory.getClient();
      
      try {
        const updatedProfile = await client.updateUserProfile(userId, data);
        
        if (updatedProfile) {
          console.log('ProfileService: Profile updated via service client fallback:', updatedProfile);
          toast.success('Profile updated successfully');
          return updatedProfile;
        }
      } catch (serviceError: any) {
        console.error('ProfileService: Service client fallback failed:', serviceError);
        throw serviceError;
      }
      
      throw directError;
    }
    
    console.log('ProfileService: Profile updated via direct Supabase:', directUpdateData);
    toast.success('Profile updated successfully');
    return directUpdateData as Profile;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    toast.error(`Failed to update profile: ${error.message}`);
    throw error;
  }
};
