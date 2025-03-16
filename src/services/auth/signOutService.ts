
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Sign out the current user
export const signOut = async () => {
  try {
    console.log('Attempting to sign out');
    
    // Clear all auth-related items from localStorage
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('supabase.auth.')) {
        localStorage.removeItem(key);
      }
    }
    
    // Sign out from Supabase with global scope to clear all sessions
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    
    if (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
    
    // Double check the session is cleared
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      console.error('Session still exists after sign out, forcing clear');
      await supabase.auth.signOut({ scope: 'global' });
    }
    
    console.log('Sign out successful and verified');
    toast.success('Successfully signed out');
    return true;
  } catch (error: any) {
    console.error('Error signing out:', error);
    toast.error(error.message || 'Failed to sign out');
    throw error;
  }
};
