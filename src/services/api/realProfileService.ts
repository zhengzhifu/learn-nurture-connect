
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { toast } from 'sonner';

export class RealProfileService {
  async fetchUserProfile(userId: string): Promise<Profile | null> {
    try {
      console.log('RealProfileService: fetchUserProfile called with userId:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, user_type, avatar_url, verified, phone, home_address, approval_status, school_id, other_school_name, child_school_id')
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
      
      // First check if we can get the current user data
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        console.error('Error getting current user:', userError);
        throw new Error('Authentication error: No valid session found');
      }
      
      console.log('RealProfileService: Current user from auth:', userData.user);
      
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
        throw new Error(`Failed to verify profile existence: ${checkError.message}`);
      }
      
      if (!existingProfile) {
        console.log('RealProfileService: Profile does not exist, creating a new one');
        
        // Prepare profile data from user metadata and input data
        const profileData = {
          id: userId,
          full_name: data.full_name || userData.user.user_metadata?.full_name || 'User',
          email: userData.user.email || '',
          user_type: data.user_type || userData.user.user_metadata?.role || 'parent',
          phone: data.phone || '',
          avatar_url: data.avatar_url || '',
          home_address: data.home_address || '',
          verified: false,
          school_id: data.school_id,
          other_school_name: data.other_school_name,
          child_school_id: data.child_school_id
        };
        
        console.log('RealProfileService: Creating profile with data:', profileData);
        
        // Create profile
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select('id, full_name, email, user_type, avatar_url, verified, phone, home_address, approval_status, school_id, other_school_name, child_school_id')
          .single();
          
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
        .select('id, full_name, email, user_type, avatar_url, verified, phone, home_address, approval_status, school_id, other_school_name, child_school_id')
        .single();
      
      if (error) {
        console.error('Error updating profile in Supabase:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        
        // If we get a "no rows affected" error, try inserting instead
        if (error.code === '22000' || error.code === 'PGRST116') {
          console.log('RealProfileService: Update failed, trying insert as fallback');
          
          // Prepare complete profile data
          const profileData = {
            id: userId,
            full_name: data.full_name || userData.user.user_metadata?.full_name || 'User',
            email: userData.user.email || '',
            user_type: data.user_type || userData.user.user_metadata?.role || 'parent',
            phone: data.phone || '',
            avatar_url: data.avatar_url || '',
            home_address: data.home_address || '',
            verified: false,
            school_id: data.school_id,
            other_school_name: data.other_school_name,
            child_school_id: data.child_school_id
          };
          
          const { data: insertedData, error: insertError } = await supabase
            .from('profiles')
            .insert(profileData)
            .select('id, full_name, email, user_type, avatar_url, verified, phone, home_address, approval_status, school_id, other_school_name, child_school_id')
            .single();
            
          if (insertError) {
            console.error('Error in fallback insert:', insertError);
            throw insertError;
          }
          
          console.log('RealProfileService: Fallback insert successful:', insertedData);
          toast.success('Profile created successfully');
          return insertedData as Profile;
        }
        
        // Otherwise throw the original error
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
