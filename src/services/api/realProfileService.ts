
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { toast } from 'sonner';

export class RealProfileService {
  async fetchUserProfile(userId: string): Promise<Profile | null> {
    try {
      console.log('RealProfileService: fetchUserProfile called with userId:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, user_type, avatar_url, verified, phone, school_name, school_address, home_address')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile from Supabase:', error);
        return null;
      }

      console.log('RealProfileService: fetchUserProfile returning:', data);
      return data as Profile;
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return null;
    }
  }
  
  async updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
    try {
      console.log('RealProfileService: updateUserProfile called with userId:', userId, 'and data:', data);
      console.log('RealProfileService: Current user from supabase auth:', await supabase.auth.getUser());
      
      // First check if we can get the current user to verify authentication
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        console.error('Error getting current user:', userError);
        throw new Error('Authentication error: No valid session found');
      }
      
      // Check if the authenticated user matches the profile ID being updated
      if (userData.user.id !== userId) {
        console.error('User ID mismatch:', userData.user.id, 'vs', userId);
        throw new Error('Unauthorized: Cannot update another user\'s profile');
      }
      
      // Proceed with the update
      console.log('RealProfileService: Proceeding with update - sending to Supabase:', data);
      const { data: updatedData, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId)
        .select('id, full_name, email, user_type, avatar_url, verified, phone, school_name, school_address, home_address')
        .maybeSingle();
      
      if (error) {
        console.error('Error updating profile in Supabase:', error);
        throw error;
      }
      
      console.log('RealProfileService: updateUserProfile returning:', updatedData);
      toast.success('Profile updated successfully');
      return updatedData as Profile;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
      throw error;
    }
  }
}

export const realProfileService = new RealProfileService();
