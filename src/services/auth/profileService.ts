
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { ServiceClientFactory } from '../api/serviceClientFactory';

// Fetch user profile data using the service client
export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('ProfileService: Fetching profile for user:', userId);
    
    // Use the security definer function through RPC to avoid RLS issues
    const { data, error } = await supabase
      .rpc('get_current_user_profile')
      .maybeSingle();
      
    if (error) {
      console.error('ProfileService: Error fetching profile:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Fall back to direct query if RPC fails (this will work with new RLS policies)
      const { data: directData, error: directError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (directError) {
        console.error('ProfileService: Error in direct profile query:', directError);
        return null;
      }
      
      if (directData) {
        console.log('ProfileService: Profile fetched via direct query:', directData);
        return directData as Profile;
      }
      
      return null;
    }

    if (!data) {
      console.log('ProfileService: No profile found, will create one on demand');
      return null;
    }

    console.log('ProfileService: Profile data fetched via RPC:', data);
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
    
    // Get current authentication status
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('ProfileService: Auth error:', authError);
      throw new Error(`Authentication error: ${authError.message}`);
    }
    
    console.log('ProfileService: User authenticated as:', authData.user?.id);
    
    // First check if profile exists
    console.log('ProfileService: Checking if profile exists');
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
      
    if (checkError) {
      console.error('ProfileService: Error checking profile:', checkError);
      throw new Error(`Failed to verify profile existence: ${checkError.message}`);
    }
    
    if (!existingProfile) {
      console.log('ProfileService: Profile does not exist, creating new profile');
      
      // Create a complete profile with user data
      const profileData = {
        id: userId,
        full_name: data.full_name || authData.user?.user_metadata?.full_name || 'User',
        email: authData.user?.email || '',
        user_type: data.user_type || authData.user?.user_metadata?.role || 'parent',
        phone: data.phone || '',
        avatar_url: data.avatar_url || '',
        home_address: data.home_address || '',
        verified: false,
        school_id: data.school_id,
        other_school_name: data.other_school_name,
        child_school_id: data.child_school_id
      };
      
      console.log('ProfileService: Creating new profile with data:', profileData);
      
      // Create profile
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select('*')
        .single();
      
      if (insertError) {
        console.error('ProfileService: Error creating profile:', insertError);
        toast.error(`Failed to create profile: ${insertError.message}`);
        throw insertError;
      }
      
      console.log('ProfileService: New profile created successfully:', newProfile);
      toast.success('Profile created successfully');
      return newProfile;
    }
    
    // Update existing profile
    console.log('ProfileService: Updating existing profile');
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId)
      .select('*')
      .single();
    
    if (updateError) {
      console.error('ProfileService: Error updating profile:', updateError);
      toast.error(`Failed to update profile: ${updateError.message}`);
      throw updateError;
    }
    
    console.log('ProfileService: Profile updated successfully:', updatedProfile);
    toast.success('Profile updated successfully');
    return updatedProfile;
  } catch (error: any) {
    console.error('ProfileService: Error in updateUserProfile:', error);
    toast.error(`Failed to update profile: ${error.message}`);
    throw error;
  }
};
