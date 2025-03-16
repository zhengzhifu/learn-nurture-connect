
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
      const userProfile = await fetchProfile(data.user.id);
      console.log('User profile fetched:', userProfile);
      
      toast.success('登录成功！');
      return { 
        user: data.user, 
        profile: userProfile || createFallbackProfile(data.user)
      };
    }
    
    return { user: null, profile: null };
  } catch (error: any) {
    console.error('Error signing in:', error);
    toast.error(error.message || '登录失败');
    throw error;
  }
};
