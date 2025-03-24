
import { supabase } from '@/integrations/supabase/client';

// Get current session
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      throw error;
    }
    
    return data.session;
  } catch (error: any) {
    console.error('Error getting session:', error);
    throw error;
  }
};

// Check if token is expired
export const isTokenExpired = () => {
  try {
    const localStorageKeys = Object.keys(localStorage);
    const authKey = localStorageKeys.find(key => key.startsWith('supabase.auth.token'));
    
    if (!authKey) return true;
    
    const authData = JSON.parse(localStorage.getItem(authKey) || '{}');
    if (!authData.expiresAt) return true;
    
    const expiresAt = new Date(authData.expiresAt * 1000);
    const now = new Date();
    
    return now >= expiresAt;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume expired in case of error
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
