
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { createFallbackProfile } from '@/utils/profileUtils';
import { fetchProfile } from './profileService';

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    console.log(`Attempting to sign in with email: ${email}`);
    
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
      // Fetch profile
      let userProfile = null;
      try {
        userProfile = await fetchProfile(data.user.id);
        console.log('User profile fetched:', userProfile);
      } catch (profileError) {
        console.error('Error fetching profile, using fallback:', profileError);
        userProfile = createFallbackProfile(data.user);
      }
      
      // Save session data to ensure token is properly stored
      if (data.session) {
        localStorage.setItem('sb-auth-token', JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        }));
      }
      
      toast.success('Login successful!');
      return { 
        user: data.user, 
        profile: userProfile || createFallbackProfile(data.user),
        session: data.session
      };
    }
    
    return { user: null, profile: null, session: null };
  } catch (error: any) {
    console.error('Error signing in:', error);
    toast.error(error.message || 'Login failed');
    throw error;
  }
};
