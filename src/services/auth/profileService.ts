
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

// Fetch user profile data from Supabase with improved error handling
export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('Fetching profile for user:', userId);
    
    // Make sure we're using the correct supabase client instance that includes API key headers
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, user_type, avatar_url, verified, phone, school_name, school_address, home_address')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    if (!data) {
      console.log('No profile found for user:', userId);
      return null;
    }

    console.log('Profile data fetched successfully:', data);
    return data as Profile;
  } catch (error: any) {
    console.error('Exception fetching profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, data: Partial<Profile>) => {
  try {
    if (!userId) throw new Error('No user logged in');
    
    console.log('Updating profile for user:', userId, 'with data:', data);
    
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId);
    
    if (error) {
      console.error('Supabase error updating profile:', error);
      throw error;
    }
    
    // Fetch updated profile
    const updatedProfile = await fetchProfile(userId);
    
    toast.success('Profile updated successfully');
    return updatedProfile;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    toast.error(`Failed to update profile: ${error.message}`);
    throw error;
  }
};
