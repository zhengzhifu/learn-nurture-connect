
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { Profile, UserRole } from '@/types/auth';
import { useAuthState } from '@/hooks/auth/useAuthState';
import { 
  signIn, 
  signUp, 
  signOut, 
  updateUserProfile 
} from '@/services/auth';
import { toast } from 'sonner';
import { refreshTokenIfNeeded } from '@/services/auth/sessionService';

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
    setError,
    setSession
  } = useAuthState();

  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signIn(email, password);
      
      if (result.user) {
        // Make sure token is refreshed if needed before navigation
        await refreshTokenIfNeeded();
        
        // Navigate after successful sign in
        navigate('/dashboard', { replace: true });
      }
    } catch (error: any) {
      setError(`Login error: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, role: UserRole, firstName: string, lastName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await signUp(email, password, role, firstName, lastName);
      navigate('/signin', { replace: true });
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
      
      // Clear state first for immediate UI feedback
      setUser(null);
      setProfile(null);
      
      // Aggressively clear localStorage
      for (const key of Object.keys(localStorage)) {
        if (key.includes('supabase.auth.') || key.includes('sb-')) {
          console.log('Removing localStorage item:', key);
          localStorage.removeItem(key);
        }
      }
      
      // Perform the sign out operation
      await signOut();
      
      // Force redirect to signin regardless of signOut result
      navigate('/signin', { replace: true });
    } catch (error: any) {
      setError(`Sign out error: ${error.message}`);
      console.error('Sign out error:', error);
      
      // Force redirect to signin on error
      navigate('/signin', { replace: true });
    } finally {
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
      
      const updatedProfile = await updateUserProfile(user.id, data);
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error: any) {
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
