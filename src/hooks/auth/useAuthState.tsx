
import { useRef, useState, useEffect } from 'react';
import { Profile } from '@/types/auth';
import { useAuthStateCore } from './useAuthStateCore';
import { useAuthListener } from './useAuthListener';
import { useSessionInitializer } from './useSessionInitializer';

/**
 * Main authentication state hook that composes other specialized hooks
 * Provides a complete authentication state management solution
 */
export const useAuthState = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const isMounted = useRef(true);
  
  // Use the core state hook
  const {
    user,
    session,
    isLoading,
    error,
    setUser,
    setSession,
    setIsLoading,
    setError,
    authTimeoutRef
  } = useAuthStateCore();
  
  // Set up auth listener
  useAuthListener(
    isMounted,
    setUser,
    setSession,
    setProfile,
    profile,
    authTimeoutRef,
    setIsLoading
  );
  
  // Initialize session
  useSessionInitializer(
    isMounted,
    setUser,
    setSession,
    setProfile,
    profile,
    authTimeoutRef,
    setIsLoading,
    setError
  );
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }
    };
  }, []);

  return {
    user,
    profile,
    session,
    isLoading,
    error,
    setUser,
    setProfile,
    setIsLoading,
    setError
  };
};
