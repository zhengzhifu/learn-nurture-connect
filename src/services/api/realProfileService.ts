
import { Profile } from '@/types/auth';
import { toast } from 'sonner';
import { BaseService } from './base/BaseService';

export class RealProfileService extends BaseService {
  async fetchUserProfile(userId: string): Promise<Profile | null> {
    try {
      console.log('RealProfileService: fetchUserProfile called with userId:', userId);
      
      const { data, error } = await this.supabase
        .from('profiles')
        .select('id, first_name, last_name, email, user_type, avatar_url, verified, phone, home_address, approval_status, school_id, other_school_name, child_school_id')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile from Supabase:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        return null;
      }

      if (data) {
        // Add full_name for backward compatibility
        const profile: Profile = {
          ...data,
          full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim()
        };
        
        console.log('RealProfileService: fetchUserProfile returning:', profile);
        return profile;
      }
      
      return null;
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return null;
    }
  }
  
  async updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
    try {
      console.log('RealProfileService: updateUserProfile called with userId:', userId, 'and data:', data);
      
      // First check if we can get the current user data
      const { data: userData, error: userError } = await this.supabase.auth.getUser();
      if (userError || !userData.user) {
        console.error('Error getting current user:', userError);
        throw new Error('Authentication error: No valid session found');
      }
      
      console.log('RealProfileService: Current user from auth:', userData.user);
      
      // Check if the profile exists first
      console.log('RealProfileService: Checking if profile exists for user ID:', userId);
      const { data: existingProfile, error: checkError } = await this.supabase
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
        
        // Split full_name into first_name and last_name if provided
        let firstName = data.first_name;
        let lastName = data.last_name;
        
        if (!firstName && !lastName && data.full_name) {
          const parts = data.full_name.split(' ');
          firstName = parts[0];
          lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
        }
        
        // Prepare profile data from user metadata and input data
        const profileData = {
          id: userId,
          first_name: firstName || userData.user.user_metadata?.first_name || 'User',
          last_name: lastName || userData.user.user_metadata?.last_name || '',
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
        const { data: newProfile, error: insertError } = await this.supabase
          .from('profiles')
          .insert(profileData)
          .select('id, first_name, last_name, email, user_type, avatar_url, verified, phone, home_address, approval_status, school_id, other_school_name, child_school_id')
          .single();
          
        if (insertError) {
          console.error('Error creating new profile:', insertError);
          console.error('Error code:', insertError.code);
          console.error('Error message:', insertError.message);
          console.error('Error details:', insertError.details);
          throw new Error(`Failed to create profile: ${insertError.message}`);
        }
        
        // Add full_name for backward compatibility
        const profile: Profile = {
          ...newProfile,
          full_name: `${newProfile.first_name || ''} ${newProfile.last_name || ''}`.trim()
        };
        
        console.log('RealProfileService: Created new profile:', profile);
        toast.success('Profile created successfully');
        return profile;
      }
      
      // Prepare update data
      const updateData: any = { ...data };
      
      // Split full_name into first_name and last_name if provided
      if (!updateData.first_name && !updateData.last_name && updateData.full_name) {
        const parts = updateData.full_name.split(' ');
        updateData.first_name = parts[0];
        updateData.last_name = parts.length > 1 ? parts.slice(1).join(' ') : '';
        // Remove full_name as it's not in the database
        delete updateData.full_name;
      }
      
      // Proceed with the update
      console.log('RealProfileService: Proceeding with update - sending to Supabase:', updateData);
      const { data: updatedData, error } = await this.supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select('id, first_name, last_name, email, user_type, avatar_url, verified, phone, home_address, approval_status, school_id, other_school_name, child_school_id')
        .single();
      
      if (error) {
        console.error('Error updating profile in Supabase:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        
        // If we get an error, try a different approach or throw the error
        throw error;
      }
      
      // Add full_name for backward compatibility
      const profile: Profile = {
        ...updatedData,
        full_name: `${updatedData.first_name || ''} ${updatedData.last_name || ''}`.trim()
      };
      
      console.log('RealProfileService: updateUserProfile successful! Returning:', profile);
      toast.success('Profile updated successfully');
      return profile;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
      throw error;
    }
  }
}

export const realProfileService = new RealProfileService();
