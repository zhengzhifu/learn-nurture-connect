
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { refreshTokenIfNeeded } from './sessionService';
import { fetchProfile } from './profile';

/**
 * Service for authenticating users with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    console.log('SignInService: Attempting to sign in with email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('SignInService: Error signing in:', error);
      toast.error(`Sign in error: ${error.message}`);
      throw error;
    }
    
    console.log('SignInService: Sign in successful for user ID:', data.user?.id);
    
    // Immediately refresh token if needed
    await refreshTokenIfNeeded();
    
    // Fetch profile data if user was successfully logged in
    if (data.user) {
      try {
        const profileData = await fetchProfile(data.user.id);
        console.log('SignInService: Fetched profile data:', profileData ? 'success' : 'not found');
      } catch (profileError) {
        console.error('SignInService: Error fetching profile:', profileError);
        // Continue anyway since profile fetch is not critical for sign in
      }
    }
    
    toast.success('Signed in successfully');
    return data;
  } catch (error: any) {
    console.error('SignInService: Exception during sign in:', error);
    throw error;
  }
};
