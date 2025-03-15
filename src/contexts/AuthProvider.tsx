import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from './AuthContext';
import { Profile, UserRole } from '@/types/auth';
import { fetchProfile, createFallbackProfile } from '@/utils/profileUtils';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Initializing auth...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError(`Error getting session: ${sessionError.message}`);
          setIsLoading(false);
          return;
        }
        
        setSession(session);
        
        if (session?.user) {
          console.log('User found in session:', session.user.id);
          setUser(session.user);
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile || createFallbackProfile(session.user));
        } else {
          console.log('No user found in session');
        }
      } catch (error: any) {
        console.error('Exception during auth initialization:', error);
        setError(`Exception during auth initialization: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, 'User ID:', session?.user?.id);
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          const userProfile = await fetchProfile(session.user.id);
          setProfile(userProfile || createFallbackProfile(session.user));
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        const userProfile = await fetchProfile(data.user.id);
        setProfile(userProfile || createFallbackProfile(data.user));
        toast.success('Signed in successfully!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(`Error signing in: ${error.message}`);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: UserRole, fullName: string) => {
    try {
      setIsLoading(true);
      setError(null);
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
      navigate('/signin');
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(`Error signing up: ${error.message}`);
      toast.error(error.message || 'Failed to sign up');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      toast.info('Signed out');
      navigate('/');
    } catch (error: any) {
      console.error('Error signing out:', error);
      setError(`Error signing out: ${error.message}`);
      toast.error(error.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      setIsLoading(true);
      setError(null);
      
      console.log('Updating profile for user:', user.id, 'with data:', data);
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
      
      if (error) {
        console.error('Supabase error updating profile:', error);
        throw error;
      }
      
      const updatedProfile = await fetchProfile(user.id);
      
      setProfile(prev => {
        const newProfile = updatedProfile || (prev ? { ...prev, ...data } : null);
        console.log('Updated profile:', newProfile);
        return newProfile;
      });
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(`Error updating profile: ${error.message}`);
      toast.error(`Failed to update profile: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      isAuthenticated: !!user, 
      isLoading, 
      error,
      signIn, 
      signUp, 
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
