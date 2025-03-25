
import { Profile } from '@/types/auth';
import { toast } from 'sonner';
import { BaseService } from '../base/BaseService';

/**
 * Service responsible for updating user profiles
 */
export class ProfileUpdateService extends BaseService {
  /**
   * Updates a user profile by ID
   */
  async updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
    try {
      console.log('ProfileUpdateService: updateUserProfile called with userId:', userId, 'and data:', data);
      
      // First check if we can get the current user data
      const { data: userData, error: userError } = await this.supabase.auth.getUser();
      if (userError || !userData.user) {
        console.error('Error getting current user:', userError);
        throw new Error('Authentication error: No valid session found');
      }
      
      console.log('ProfileUpdateService: Current user from auth:', userData.user);
      
      // Check if the profile exists first
      console.log('ProfileUpdateService: Checking if profile exists for user ID:', userId);
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
        return await this.createNewProfile(userId, userData.user, data);
      }
      
      return await this.updateExistingProfile(userId, data);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
      throw error;
    }
  }

  /**
   * Creates a new profile when one doesn't exist
   */
  private async createNewProfile(userId: string, user: any, data: Partial<Profile>): Promise<Profile | null> {
    console.log('ProfileUpdateService: Profile does not exist, creating a new one');
        
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
      first_name: firstName || user.user_metadata?.first_name || 'User',
      last_name: lastName || user.user_metadata?.last_name || '',
      email: user.email || '',
      user_type: data.user_type || user.user_metadata?.role || 'parent',
      phone: data.phone || '',
      avatar_url: data.avatar_url || '',
      home_address: data.home_address || '',
      school_id: data.school_id || null,
      latitude: data.latitude,
      longitude: data.longitude
    };
    
    console.log('ProfileUpdateService: Creating profile with data:', profileData);
    
    // Create profile
    const { data: newProfile, error: insertError } = await this.supabase
      .from('profiles')
      .insert(profileData)
      .select('*')
      .single();
      
    if (insertError) {
      console.error('Error creating new profile:', insertError);
      console.error('Error code:', insertError.code);
      console.error('Error message:', insertError.message);
      console.error('Error details:', insertError.details);
      throw new Error(`Failed to create profile: ${insertError.message}`);
    }
    
    if (!newProfile) {
      throw new Error('Failed to create profile: No data returned');
    }
    
    // Create a valid Profile object from the data
    const profile: Profile = {
      id: newProfile.id || '',
      first_name: newProfile.first_name || '',
      last_name: newProfile.last_name || '',
      email: newProfile.email || '',
      user_type: newProfile.user_type || 'parent',
      phone: newProfile.phone || '',
      avatar_url: newProfile.avatar_url || '',
      home_address: newProfile.home_address || '',
      approval_status: newProfile.approval_status || 'pending',
      school_id: newProfile.school_id || '',
      latitude: newProfile.latitude,
      longitude: newProfile.longitude,
      // Add empty strings for fields that might not exist in the database
      other_school_name: '',
      verified: false,
      // Add derived full_name for backward compatibility
      full_name: `${newProfile.first_name || ''} ${newProfile.last_name || ''}`.trim()
    };
    
    console.log('ProfileUpdateService: Created new profile:', profile);
    toast.success('Profile created successfully');
    return profile;
  }

  /**
   * Updates an existing profile
   */
  private async updateExistingProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
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
    
    // Remove fields that don't exist in the database
    if ('verified' in updateData) {
      delete updateData.verified;
    }
    if ('other_school_name' in updateData) {
      delete updateData.other_school_name;
    }
    
    // Proceed with the update
    console.log('ProfileUpdateService: Proceeding with update - sending to Supabase:', updateData);
    const { data: updatedData, error } = await this.supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating profile in Supabase:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      
      // If we get an error, throw it
      throw error;
    }
    
    if (!updatedData) {
      throw new Error('Failed to update profile: No data returned');
    }
    
    // Create a valid Profile object from the data
    const profile: Profile = {
      id: updatedData.id || '',
      first_name: updatedData.first_name || '',
      last_name: updatedData.last_name || '',
      email: updatedData.email || '',
      user_type: updatedData.user_type || 'parent',
      phone: updatedData.phone || '',
      avatar_url: updatedData.avatar_url || '',
      home_address: updatedData.home_address || '',
      approval_status: updatedData.approval_status || 'pending',
      school_id: updatedData.school_id || '',
      latitude: updatedData.latitude,
      longitude: updatedData.longitude,
      // Add empty strings for fields that might not exist in the database
      other_school_name: '',
      verified: false,
      // Add derived full_name for backward compatibility
      full_name: `${updatedData.first_name || ''} ${updatedData.last_name || ''}`.trim()
    };
    
    console.log('ProfileUpdateService: updateUserProfile successful! Returning:', profile);
    toast.success('Profile updated successfully');
    return profile;
  }
}

export const profileUpdateService = new ProfileUpdateService();
