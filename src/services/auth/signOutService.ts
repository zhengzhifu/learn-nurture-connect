
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Sign out the current user
export const signOut = async () => {
  try {
    console.log('Attempting to sign out');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
    
    console.log('Sign out successful');
    toast.info('已退出登录');
    return true;
  } catch (error: any) {
    console.error('Error signing out:', error);
    toast.error(error.message || '退出登录失败');
    throw error;
  }
};
