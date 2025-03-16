
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
import { toast } from 'sonner';

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

  // Log auth state for debugging
  useEffect(() => {
    console.log('AuthProvider: auth state updated', {
      isAuthenticated: !!user,
      hasProfile: !!profile,
      isLoading,
      hasError: !!error
    });
  }, [user, profile, isLoading, error]);

  // Listen for auth state changes directly in the provider
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed in provider:', event, session?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state');
          setUser(null);
          setProfile(null);
          // Force navigate to home page on sign out
          navigate('/', { replace: true });
        }
        
        // Make sure we're not stuck in loading state
        if (isLoading) {
          setTimeout(() => {
            console.log('Force clearing loading state after timeout');
            setIsLoading(false);
          }, 3000); // Set a timeout to ensure loading state gets cleared
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setProfile, isLoading, setIsLoading, navigate]);

  // Direct session check to ensure UI is in sync with auth state
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session && !user) {
          console.log('Session exists but no user in state, updating...');
          setUser(data.session.user);
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    };
    
    checkSession();
  }, [user, setUser]);

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
      console.log('handleSignOut called in AuthProvider');
      setIsLoading(true);
      setError(null);
      
      // Clear state first for immediate UI feedback
      setUser(null);
      setProfile(null);
      
      // Perform the sign out operation
      await signOut();
      
      // Force redirect to home page immediately after sign out
      console.log('Sign out complete, navigating to home page');
      navigate('/', { replace: true });
    } catch (error: any) {
      setError(`Sign out error: ${error.message}`);
      console.error('Sign out error:', error);
    } finally {
      // Make sure loading state is cleared regardless of outcome
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (data: Partial<Profile>) => {
    try {
      if (!user) {
        toast.error('Not logged in');
        throw new Error('Not logged in');
      }
      
      setIsLoading(true);
      setError(null);
      
      console.log('AuthProvider: Updating profile with data:', data);
      
      const updatedProfile = await updateUserProfile(user.id, data);
      
      if (updatedProfile) {
        console.log('AuthProvider: Profile updated successfully:', updatedProfile);
        setProfile(updatedProfile);
        toast.success('Profile updated successfully');
      } else {
        console.error('AuthProvider: Profile update returned null');
        toast.error('Failed to update profile');
      }
    } catch (error: any) {
      console.error('AuthProvider: Profile update error:', error);
      setError(`Profile update error: ${error.message}`);
      toast.error(`Profile update error: ${error.message}`);
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
