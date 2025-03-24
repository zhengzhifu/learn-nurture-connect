
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Sign out the current user
export const signOut = async () => {
  try {
    console.log('Attempting to sign out');
    
    // Sign out from Supabase with global scope to clear all sessions
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    
    if (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
    
    // Aggressively clear all auth-related items from localStorage
    for (const key of Object.keys(localStorage)) {
      if (key.includes('supabase.auth.') || key.includes('sb-')) {
        console.log('Removing localStorage item:', key);
        localStorage.removeItem(key);
      }
    }
    
    console.log('Sign out successful');
    toast.success('Successfully signed out');
    
    // Force refresh the page after a slight delay to clear all React state
    setTimeout(() => {
      window.location.href = '/signin';
    }, 100);
    
    return true;
  } catch (error: any) {
    console.error('Error signing out:', error);
    toast.error(error.message || 'Failed to sign out');
    throw error;
  }
};
