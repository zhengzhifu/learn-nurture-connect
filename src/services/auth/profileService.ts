
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
    
    const profile = await client.fetchUserProfile(userId);
    
    if (!profile) {
      console.log('No profile found for user:', userId);
      // Try direct Supabase query as fallback
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, user_type, avatar_url, verified, phone, school_name, school_address, home_address')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error in fallback profile fetch:', error);
        return null;
      }

      if (!data) {
        console.log('No profile found in fallback query');
        return null;
      }

      console.log('Profile data fetched from fallback:', data);
      return data as Profile;
    }

    console.log('Profile data fetched successfully:', profile);
    return profile;
  } catch (error: any) {
    console.error('Exception fetching profile:', error);
    // Don't throw error, return null and use fallback profile
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, data: Partial<Profile>): Promise<Profile | null> => {
  try {
    if (!userId) throw new Error('No user logged in');
    
    console.log('ProfileService: Updating profile for user:', userId, 'with data:', data);
    
    // Verify we're using realServiceClient
    const client = ServiceClientFactory.getClient();
    console.log('ProfileService: Using client type:', client === realServiceClient ? 'realServiceClient' : 'other');
    console.log('ProfileService: Is user authenticated?', (await supabase.auth.getUser()).data?.user ? 'Yes' : 'No');
    
    // Direct Supabase update as a fallback if the service client fails
    let updatedProfile: Profile | null = null;
    
    try {
      // Try using the service client first
      updatedProfile = await client.updateUserProfile(userId, data);
      console.log('ProfileService: Profile updated via service client:', updatedProfile);
    } catch (serviceError: any) {
      console.error('ProfileService: Service client update failed, trying direct Supabase:', serviceError);
      
      // If service client fails, try direct Supabase update
      const { data: directUpdateData, error: directError } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId)
        .select('id, full_name, email, user_type, avatar_url, verified, phone, school_name, school_address, home_address')
        .maybeSingle();
      
      if (directError) {
        console.error('ProfileService: Direct Supabase update failed:', directError);
        console.error('Error code:', directError.code);
        console.error('Error message:', directError.message);
        console.error('Error details:', directError.details);
        throw directError;
      }
      
      updatedProfile = directUpdateData as Profile;
      console.log('ProfileService: Profile updated via direct Supabase:', updatedProfile);
    }
    
    if (!updatedProfile) {
      throw new Error('Failed to update profile - no data returned');
    }
    
    toast.success('Profile updated successfully');
    return updatedProfile;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    toast.error(`Failed to update profile: ${error.message}`);
    throw error;
  }
};
