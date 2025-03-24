
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

// Check if token is expired or missing
export const isTokenExpired = async () => {
  try {
    // First check if we have a valid session via Supabase API
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking session:', error);
      return true;
    }
    
    if (data.session) {
      // We have a valid session, token is not expired
      console.log('Valid session found via Supabase API');
      return false;
    }
    
    // As fallback, check for token in localStorage (used by Supabase)
    const localStorageKeys = Object.keys(localStorage);
    const authKey = localStorageKeys.find(key => 
      key.startsWith('supabase.auth.token') || 
      key.startsWith('sb-') && key.includes('-auth-token')
    );
    
    if (!authKey) {
      console.log('No auth token found in localStorage');
      return true;
    }
    
    // Parse the token data
    try {
      const authData = JSON.parse(localStorage.getItem(authKey) || '{}');
      if (!authData.expiresAt) {
        console.log('No expiration data found in token');
        return true;
      }
      
      // Check if token is expired
      const expiresAt = new Date(authData.expiresAt * 1000);
      const now = new Date();
      const isExpired = now >= expiresAt;
      
      // Log the expiration status
      if (isExpired) {
        console.log('Token is expired, expires at:', expiresAt.toISOString(), 'now:', now.toISOString());
      } else {
        console.log('Token is valid, expires at:', expiresAt.toISOString(), 'now:', now.toISOString());
      }
      
      return isExpired;
    } catch (parseError) {
      console.error('Error parsing token data:', parseError);
      return true;
    }
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
