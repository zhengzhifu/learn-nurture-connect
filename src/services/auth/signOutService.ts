
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Sign out the current user
export const signOut = async () => {
  try {
    console.log('Attempting to sign out');
    
    // Clear any stored session data
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('supabase.auth.expires_at');
    localStorage.removeItem('supabase.auth.refresh_token');
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    
    if (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
    
    console.log('Sign out successful from Supabase');
    toast.success('Successfully signed out');
    return true;
  } catch (error: any) {
    console.error('Error signing out:', error);
    toast.error(error.message || 'Failed to sign out');
    throw error;
  }
};
