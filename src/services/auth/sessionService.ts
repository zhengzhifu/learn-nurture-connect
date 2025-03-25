
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

// Check if token is expired or missing (locally first, then fallback to Supabase if needed)
export const isTokenExpired = () => {
  // First check localStorage for token data (fast path)
  const localStorageKeys = Object.keys(localStorage);
  const authKey = localStorageKeys.find(key => 
    key.startsWith('supabase.auth.token') || 
    (key.startsWith('sb-') && key.includes('-auth-token'))
  );
  
  if (!authKey) {
    console.log('No auth token found in localStorage');
    return true;
  }
  
  // Parse the token data
  try {
    const authData = JSON.parse(localStorage.getItem(authKey) || '{}');
    if (!authData.expiresAt && !authData.expires_at) {
      console.log('No expiration data found in token');
      return true;
    }
    
    // Check if token is expired
    const expiresAt = new Date((authData.expiresAt || authData.expires_at) * 1000);
    const now = new Date();
    const isExpired = now >= expiresAt;
    
    // Log the expiration status
    if (isExpired) {
      console.log('Token is expired, expires at:', expiresAt.toISOString(), 'now:', now.toISOString());
      
      // Clear all auth-related items if expired
      for (const key of Object.keys(localStorage)) {
        if (key.includes('supabase.auth.') || key.includes('sb-')) {
          console.log('Token expired: Removing localStorage item:', key);
          localStorage.removeItem(key);
        }
      }
    } else {
      console.log('Token is valid, expires at:', expiresAt.toISOString(), 'now:', now.toISOString());
    }
    
    return isExpired;
  } catch (parseError) {
    console.error('Error parsing token data:', parseError);
    return true;
  }
};

// Refresh the token if it's close to expiring
export const refreshTokenIfNeeded = async () => {
  try {
    // Get the current session
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      console.log('No active session to refresh');
      return false;
    }
    
    // Calculate how much time is left before the token expires
    const expiresAt = new Date(data.session.expires_at * 1000);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    
    // If token expires in less than 5 minutes (300000 ms), refresh it
    if (timeUntilExpiry < 300000) {
      console.log('Token is about to expire, refreshing...');
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('Error refreshing token:', refreshError);
        return false;
      }
      
      // Save the refreshed session to localStorage to ensure it's available
      if (refreshData.session) {
        localStorage.setItem('sb-auth-token', JSON.stringify({
          access_token: refreshData.session.access_token,
          refresh_token: refreshData.session.refresh_token,
          expires_at: refreshData.session.expires_at
        }));
      }
      
      console.log('Token refreshed successfully');
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error in refreshTokenIfNeeded:', error);
    return false;
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
