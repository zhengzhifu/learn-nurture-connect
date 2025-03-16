
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
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
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
      
      // Check if the profile exists first
      console.log('RealProfileService: Checking if profile exists for user ID:', userId);
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking if profile exists:', checkError);
        console.error('Error code:', checkError.code);
        console.error('Error message:', checkError.message);
        throw new Error('Failed to verify profile existence');
      }
      
      if (!existingProfile) {
        console.log('RealProfileService: Profile does not exist, creating a new one');
        // Create profile if it doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({ 
            id: userId,
            full_name: data.full_name || userData.user.user_metadata?.full_name || 'User',
            email: userData.user.email || '',
            user_type: data.user_type || userData.user.user_metadata?.role || 'parent',
            ...data
          })
          .select('id, full_name, email, user_type, avatar_url, verified, phone, school_name, school_address, home_address')
          .maybeSingle();
          
        if (insertError) {
          console.error('Error creating new profile:', insertError);
          console.error('Error code:', insertError.code);
          console.error('Error message:', insertError.message);
          console.error('Error details:', insertError.details);
          throw new Error(`Failed to create profile: ${insertError.message}`);
        }
        
        console.log('RealProfileService: Created new profile:', newProfile);
        toast.success('Profile created successfully');
        return newProfile as Profile;
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
        // Log more details about the error
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        
        // Check if this is a permissions error
        if (error.code === 'PGRST301' || error.message.includes('permission denied')) {
          throw new Error('Permission denied: You may not have rights to update this profile');
        }
        
        throw error;
      }
      
      console.log('RealProfileService: updateUserProfile successful! Returning:', updatedData);
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
