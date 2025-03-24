
import { useState, useEffect, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Core hook that manages the basic authentication state
 * Handles user, session, loading and error states
 */
export const useAuthStateCore = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear the auth timeout if component unmounts
  useEffect(() => {
    return () => {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }
    };
  }, []);

  return {
    user,
    session,
    isLoading,
    error,
    setUser,
    setSession,
    setIsLoading,
    setError,
    authTimeoutRef
  };
};
