
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole } from '@/types/auth';
import { fetchProfile, createFallbackProfile } from '@/utils/profileUtils';

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    console.log(`Attempting to sign in with email: ${email}`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Auth error during sign in:', error);
      throw error;
    }
    
    console.log('Sign in successful, user data:', data.user?.id);
    
    if (data.user) {
      // Fetch profile
      const userProfile = await fetchProfile(data.user.id);
      console.log('User profile fetched:', userProfile);
      
      toast.success('Signed in successfully!');
      return { 
        user: data.user, 
        profile: userProfile || createFallbackProfile(data.user)
      };
    }
    
    return { user: null, profile: null };
  } catch (error: any) {
    console.error('Error signing in:', error);
    toast.error(error.message || 'Failed to sign in');
    throw error;
  }
};

// Sign up with email, password, role and full name
export const signUp = async (email: string, password: string, role: UserRole, fullName: string) => {
  try {
    console.log(`Signing up with email: ${email}, role: ${role}, name: ${fullName}`);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
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

// Sign out the current user
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    toast.info('Signed out');
    return true;
  } catch (error: any) {
    console.error('Error signing out:', error);
    toast.error(error.message || 'Failed to sign out');
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, data: Partial<Profile>) => {
  try {
    if (!userId) throw new Error('No user logged in');
    
    console.log('Updating profile for user:', userId, 'with data:', data);
    
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId);
    
    if (error) {
      console.error('Supabase error updating profile:', error);
      throw error;
    }
    
    // Fetch updated profile
    const updatedProfile = await fetchProfile(userId);
    
    toast.success('Profile updated successfully');
    return updatedProfile;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    toast.error(`Failed to update profile: ${error.message}`);
    throw error;
  }
};

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
