
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
            setIsLoading(false);
          }, 3000); // Set a timeout to ensure loading state gets cleared
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setProfile, isLoading, setIsLoading, navigate]);

  // Safeguard against infinite loading
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        console.log('Force clearing loading state after timeout');
        setIsLoading(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, setIsLoading]);

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
      setIsLoading(true);
      setError(null);
      
      await signOut();
      
      // Clear state immediately, don't wait for the auth state change event
      setUser(null);
      setProfile(null);
      
      // Force redirect to home page
      navigate('/', { replace: true });
      
      console.log('Sign out and navigation complete');
    } catch (error: any) {
      setError(`Sign out error: ${error.message}`);
      console.error('Sign out error:', error);
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
