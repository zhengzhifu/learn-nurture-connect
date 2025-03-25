
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

// Sign up with email, password, role and full name
export const signUp = async (email: string, password: string, role: UserRole, fullName: string) => {
  try {
    console.log(`Signing up with email: ${email}, role: ${role}, name: ${fullName}`);
    
    // Split full name into first and last name
    let firstName = fullName;
    let lastName = '';
    
    // If there's a space, split by the first space
    if (fullName.includes(' ')) {
      const nameParts = fullName.split(' ');
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' ');
    }
    
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
