
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { Profile, UserRole } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { 
  signIn, 
  signUp, 
  signOut, 
  updateUserProfile 
} from '@/services/auth';
import { supabase } from '@/integrations/supabase/client';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { 
    user, 
    profile, 
    isLoading, 
    error, 
    setProfile, 
    setUser, 
    setIsLoading, 
    setError 
  } = useAuthState();

  // Listen for auth state changes directly in the provider
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed in provider:', event, session?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state');
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setProfile]);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signIn(email, password);
      
      if (result.user) {
        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(`Login error: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, role: UserRole, fullName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await signUp(email, password, role, fullName);
      navigate('/signin');
    } catch (error: any) {
      setError(`Registration error: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await signOut();
      setUser(null);
      setProfile(null);
      navigate('/');
    } catch (error: any) {
      setError(`Sign out error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (data: Partial<Profile>) => {
    try {
      if (!user) throw new Error('Not logged in');
      
      setIsLoading(true);
      setError(null);
      
      const updatedProfile = await updateUserProfile(user.id, data);
      
      setProfile(prev => {
        const newProfile = updatedProfile || (prev ? { ...prev, ...data } : null);
        console.log('Updated profile:', newProfile);
        return newProfile;
      });
    } catch (error: any) {
      setError(`Profile update error: ${error.message}`);
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
      signIn: handleSignIn, 
      signUp: handleSignUp, 
      signOut: handleSignOut,
      updateProfile: handleUpdateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
