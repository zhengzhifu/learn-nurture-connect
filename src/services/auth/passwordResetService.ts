
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Request a password reset email
export const requestPasswordReset = async (email: string, redirectUrl: string) => {
  try {
    console.log(`Requesting password reset for email: ${email}`);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    if (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
    
    toast.success('Password reset instructions sent to your email');
    return true;
  } catch (error: any) {
    console.error('Error requesting password reset:', error);
    toast.error(error.message || 'Failed to send password reset email');
    throw error;
  }
};

// Complete the password reset (update password)
export const updatePassword = async (newPassword: string) => {
  try {
    console.log('Updating password');
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error('Error updating password:', error);
      throw error;
    }
    
    toast.success('Password updated successfully');
    return true;
  } catch (error: any) {
    console.error('Error updating password:', error);
    toast.error(error.message || 'Failed to update password');
    throw error;
  }
};
