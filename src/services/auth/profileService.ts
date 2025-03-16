
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { ServiceClientFactory } from '../api/serviceClientFactory';
import { realServiceClient } from '../api/realServiceClient';

// Fetch user profile data using the service client
export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('ProfileService: Fetching profile for user:', userId);
    
    // Use the service client to fetch the profile
    const client = ServiceClientFactory.getClient();
    console.log('ProfileService: Using client type:', client === realServiceClient ? 'realServiceClient' : 'other');
    
    const profile = await client.fetchUserProfile(userId);
    
    if (!profile) {
      console.log('ProfileService: No profile found for user:', userId);
      // Try direct Supabase query as fallback
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, user_type, avatar_url, verified, phone, school_name, school_address, home_address')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('ProfileService: Error in fallback profile fetch:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        return null;
      }

      if (!data) {
        console.log('ProfileService: No profile found in fallback query');
        return null;
      }

      console.log('ProfileService: Profile data fetched from fallback:', data);
      return data as Profile;
    }

    console.log('ProfileService: Profile data fetched successfully:', profile);
    return profile;
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
    
    // Verify we're using realServiceClient
    const client = ServiceClientFactory.getClient();
    console.log('ProfileService: Using client type:', client === realServiceClient ? 'realServiceClient' : 'other');
    console.log('ProfileService: Is user authenticated?', (await supabase.auth.getUser()).data?.user ? 'Yes' : 'No');
    
    try {
      // Try using the service client first
      console.log('ProfileService: Calling client.updateUserProfile with:', userId, data);
      const updatedProfile = await client.updateUserProfile(userId, data);
      console.log('ProfileService: Profile updated via service client:', updatedProfile);
      
      if (updatedProfile) {
        toast.success('Profile updated successfully');
        return updatedProfile;
      } else {
        throw new Error('Profile update returned null result');
      }
    } catch (serviceError: any) {
      console.error('ProfileService: Service client update failed, details:', serviceError);
      
      // If service client fails, try direct Supabase update
      console.log('ProfileService: Trying direct Supabase update as fallback');
      
      // First check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking if profile exists:', checkError);
        throw new Error('Failed to verify profile existence');
      }
      
      if (!existingProfile) {
        console.log('Profile does not exist, creating a new one via direct API');
        const userDetails = await supabase.auth.getUser();
        const userData = userDetails.data.user;
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({ 
            id: userId,
            full_name: data.full_name || userData?.user_metadata?.full_name || 'User',
            email: userData?.email || '',
            user_type: data.user_type || userData?.user_metadata?.role || 'parent',
            ...data
          })
          .select('id, full_name, email, user_type, avatar_url, verified, phone, school_name, school_address, home_address')
          .maybeSingle();
          
        if (insertError) {
          console.error('Error creating new profile directly:', insertError);
          throw insertError;
        }
        
        console.log('ProfileService: Created new profile directly:', newProfile);
        toast.success('Profile created successfully');
        return newProfile as Profile;
      }
      
      const { data: directUpdateData, error: directError } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId)
        .select('id, full_name, email, user_type, avatar_url, verified, phone, school_name, school_address, home_address')
        .maybeSingle();
      
      if (directError) {
        console.error('ProfileService: Direct Supabase update failed:', directError);
        console.error('Error code:', directError.code);
        console.error('Error message:', directError.message);
        console.error('Error details:', directError.details);
        throw directError;
      }
      
      console.log('ProfileService: Profile updated via direct Supabase:', directUpdateData);
      toast.success('Profile updated successfully');
      return directUpdateData as Profile;
    }
  } catch (error: any) {
    console.error('Error updating profile:', error);
    toast.error(`Failed to update profile: ${error.message}`);
    throw error;
  }
};
