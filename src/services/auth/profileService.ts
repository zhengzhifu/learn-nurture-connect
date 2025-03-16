
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { ServiceClientFactory } from '../api/serviceClientFactory';

// Fetch user profile data using the service client
export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('ProfileService: Fetching profile for user:', userId);
    
    // Use the service client to fetch the profile
    const client = ServiceClientFactory.getClient();
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
export const updateUserProfile = async (userId: string, data: Partial<Profile>) => {
  try {
    if (!userId) throw new Error('No user logged in');
    
    console.log('ProfileService: Updating profile for user:', userId, 'with data:', data);
    
    // Use the service client to update the profile
    const client = ServiceClientFactory.getClient();
    const updatedProfile = await client.updateUserProfile(userId, data);
    
    if (!updatedProfile) {
      throw new Error('Failed to update profile');
    }
    
    toast.success('Profile updated successfully');
    return updatedProfile;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    toast.error(`Failed to update profile: ${error.message}`);
    throw error;
  }
};
