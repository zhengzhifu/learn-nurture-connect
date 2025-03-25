
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { ServiceClientFactory } from '../api/serviceClientFactory';

// Fetch user profile data using the service client
export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('ProfileService: Fetching profile for user:', userId);
    
    // Add a timeout to ensure the function doesn't hang indefinitely
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => reject(new Error('Profile fetch timed out')), 5000);
    });
    
    // Create the RPC promise
    const rpcPromise = async () => {
      const { data, error } = await supabase
        .rpc('get_current_user_profile')
        .maybeSingle();
        
      if (error) {
        console.error('ProfileService: Error fetching profile via RPC:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // Fall back to direct query
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
          // Add full_name for backward compatibility
          const profile: Profile = {
            ...directData,
            full_name: `${directData.first_name || ''} ${directData.last_name || ''}`.trim()
          };
          
          console.log('ProfileService: Profile fetched via direct query:', profile);
          return profile;
        }
        
        return null;
      }

      if (!data) {
        console.log('ProfileService: No profile found, will create one on demand');
        return null;
      }

      // Add full_name for backward compatibility
      const profile: Profile = {
        ...data,
        full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim()
      };
      
      console.log('ProfileService: Profile data fetched via RPC:', profile);
      return profile;
    };

    // Race the fetch against the timeout
    const profile = await Promise.race([rpcPromise(), timeoutPromise]);
    return profile;
  } catch (error: any) {
    console.error('ProfileService: Exception fetching profile:', error);
    // Make sure we always return null on error, don't leave promises hanging
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
        other_school_name: data.other_school_name
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
      
      // Add full_name for backward compatibility
      const profile: Profile = {
        ...newProfile,
        full_name: `${newProfile.first_name || ''} ${newProfile.last_name || ''}`.trim()
      };
      
      console.log('ProfileService: New profile created successfully:', profile);
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
    console.log('ProfileService: Updating existing profile with data:', updateData);
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select('*')
      .single();
    
    if (updateError) {
      console.error('ProfileService: Error updating profile:', updateError);
      toast.error(`Failed to update profile: ${updateError.message}`);
      throw updateError;
    }
    
    // Add full_name for backward compatibility
    const profile: Profile = {
      ...updatedProfile,
      full_name: `${updatedProfile.first_name || ''} ${updatedProfile.last_name || ''}`.trim()
    };
    
    console.log('ProfileService: Profile updated successfully:', profile);
    toast.success('Profile updated successfully');
    return profile;
  } catch (error: any) {
    console.error('ProfileService: Error in updateUserProfile:', error);
    toast.error(`Failed to update profile: ${error.message}`);
    throw error;
  }
};
