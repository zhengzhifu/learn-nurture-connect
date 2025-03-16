
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Request password reset
export const requestPasswordReset = async (email: string, redirectUrl: string) => {
  try {
    console.log(`Requesting password reset for: ${email}`);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    if (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
    
    console.log('Password reset email sent successfully');
    toast.success('密码重置邮件已发送，请检查您的邮箱');
    return true;
  } catch (error: any) {
    console.error('Error in password reset:', error);
    toast.error(error.message || '发送密码重置邮件失败');
    throw error;
  }
};

// Update password with the reset token
export const updatePasswordWithToken = async (newPassword: string) => {
  try {
    console.log('Updating password with reset token');
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      console.error('Error updating password:', error);
      throw error;
    }
    
    console.log('Password updated successfully');
    toast.success('密码已成功更新');
    return true;
  } catch (error: any) {
    console.error('Error updating password:', error);
    toast.error(error.message || '更新密码失败');
    throw error;
  }
};
