
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

// Sign up with email, password, role, first name and last name
export const signUp = async (email: string, password: string, role: UserRole, firstName: string, lastName: string) => {
  try {
    console.log(`Signing up with email: ${email}, role: ${role}, name: ${firstName} ${lastName}`);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          user_type: role,
        },
      },
    });

    if (error) {
      console.error('Supabase signup error:', error);
      throw error;
    }
    
    console.log('Signup successful:', data);
    toast.success('Account created successfully! Please check your email for verification.');
    return data;
  } catch (error: any) {
    console.error('Error signing up:', error);
    toast.error(error.message || 'Failed to sign up');
    throw error;
  }
};
