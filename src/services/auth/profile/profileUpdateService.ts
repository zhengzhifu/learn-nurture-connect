
import { Profile } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Service for updating user profiles
 */
export const updateUserProfile = async (userId: string, data: Partial<Profile>): Promise<Profile | null> => {
  try {
    if (!userId) throw new Error('No user logged in');
    
    console.log('ProfileUpdateService: Updating profile for user:', userId, 'with data:', data);
    
    // Get current authentication status
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('ProfileUpdateService: Auth error:', authError);
      throw new Error(`Authentication error: ${authError.message}`);
    }
    
    console.log('ProfileUpdateService: User authenticated as:', authData.user?.id);
    
    // First check if profile exists
    console.log('ProfileUpdateService: Checking if profile exists');
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    if (checkError) {
      console.error('ProfileUpdateService: Error checking profile:', checkError);
      throw new Error(`Failed to verify profile existence: ${checkError.message}`);
    }
    
    if (!existingProfile) {
      console.log('ProfileUpdateService: Profile does not exist, creating new profile');
      
      // Split full_name into first_name and last_name if provided
      let firstName = data.first_name;
      let lastName = data.last_name;
      
      if (!firstName && !lastName && data.full_name) {
        const parts = data.full_name.split(' ');
        firstName = parts[0];
        lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
      }
      
      // Create a complete profile with user data
      const profileData = {
        id: userId,
        first_name: firstName || authData.user?.user_metadata?.first_name || 'User',
        last_name: lastName || authData.user?.user_metadata?.last_name || '',
        email: authData.user?.email || '',
        user_type: data.user_type || authData.user?.user_metadata?.role || 'parent',
        phone: data.phone || '',
        avatar_url: data.avatar_url || '',
        home_address: data.home_address || '',
        verified: false,
        school_id: data.school_id,
        other_school_name: data.other_school_name,
        latitude: data.latitude,
        longitude: data.longitude
      };
      
      console.log('ProfileUpdateService: Creating new profile with data:', profileData);
      
      // Create profile
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select('*')
        .single();
      
      if (insertError) {
        console.error('ProfileUpdateService: Error creating profile:', insertError);
        toast.error(`Failed to create profile: ${insertError.message}`);
        throw insertError;
      }
      
      // Add full_name for backward compatibility
      const profile: Profile = {
        ...newProfile,
        full_name: `${newProfile.first_name || ''} ${newProfile.last_name || ''}`.trim()
      };
      
      console.log('ProfileUpdateService: New profile created successfully:', profile);
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
    
    // Update existing profile
    console.log('ProfileUpdateService: Updating existing profile with data:', updateData);
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select('*')
      .single();
    
    if (updateError) {
      console.error('ProfileUpdateService: Error updating profile:', updateError);
      toast.error(`Failed to update profile: ${updateError.message}`);
      throw updateError;
    }
    
    // Add full_name for backward compatibility
    const profile: Profile = {
      ...updatedProfile,
      full_name: `${updatedProfile.first_name || ''} ${updatedProfile.last_name || ''}`.trim()
    };
    
    console.log('ProfileUpdateService: Profile updated successfully:', profile);
    toast.success('Profile updated successfully');
    return profile;
  } catch (error: any) {
    console.error('ProfileUpdateService: Error in updateUserProfile:', error);
    toast.error(`Failed to update profile: ${error.message}`);
    throw error;
  }
};
