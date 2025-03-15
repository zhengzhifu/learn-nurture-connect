
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { createFallbackProfile } from '@/utils/profileUtils';
import { fetchProfile } from './profileService';

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    console.log(`Attempting to sign in with email: ${email}`);
    
    // Ensure we have a valid session
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Auth error during sign in:', error);
      throw error;
    }
    
    console.log('Sign in successful, user data:', data.user?.id);
    
    if (data.user) {
      try {
        // Fetch profile with improved error handling
        const userProfile = await fetchProfile(data.user.id);
        console.log('User profile fetched:', userProfile);
        
        toast.success('Signed in successfully!');
        return { 
          user: data.user, 
          profile: userProfile || createFallbackProfile(data.user)
        };
      } catch (profileError) {
        console.error('Error fetching profile, using fallback:', profileError);
        // Fall back to metadata if profile fetch fails
        return {
          user: data.user,
          profile: createFallbackProfile(data.user)
        };
      }
    }
    
    return { user: null, profile: null };
  } catch (error: any) {
    console.error('Error signing in:', error);
    toast.error(error.message || 'Failed to sign in');
    throw error;
  }
};
