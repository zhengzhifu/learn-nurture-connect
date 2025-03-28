
import { supabase } from '@/integrations/supabase/client';

// Get current session
export const getCurrentSession = async () => {
  try {
    console.log('Fetching current session');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      throw error;
    }
    
    console.log('Session data:', data.session ? 'Session exists' : 'No active session');
    return data.session;
  } catch (error: any) {
    console.error('Error getting session:', error);
    throw error;
  }
};

// Reset password for email
export const resetPasswordForEmail = async (email: string, redirectUrl: string) => {
  try {
    console.log(`Requesting password reset for email: ${email}`);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    if (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
    
    console.log('Password reset email sent successfully');
    return true;
  } catch (error: any) {
    console.error('Error resetting password:', error);
    throw error;
  }
};
