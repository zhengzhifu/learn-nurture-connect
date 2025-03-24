
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { fetchProfile } from '@/services/auth';
import { createFallbackProfile } from '@/utils/profileUtils';
import { isTokenExpired } from '@/services/auth/sessionService';

/**
 * Hook that initializes the session state
 * Checks for an existing session and fetches the user profile
 */
export const useSessionInitializer = (
  isMounted: React.MutableRefObject<boolean>,
  setUser: (user: import('@supabase/supabase-js').User | null) => void,
  setSession: (session: import('@supabase/supabase-js').Session | null) => void,
  setProfile: (profile: Profile | null) => void,
  profile: Profile | null,
  authTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void
) => {
  useEffect(() => {
    const initializeSession = async () => {
      if (!isMounted.current) return;
        
      // Set a timeout to prevent getting stuck in loading state
      authTimeoutRef.current = setTimeout(() => {
        if (isMounted.current && setIsLoading) {
          console.warn('Force clearing loading state after timeout');
          setIsLoading(false);
          
          // Check if token exists but might be expired
          if (isTokenExpired()) {
            setError('Authentication session expired or invalid');
            setUser(null);
            setProfile(null);
            setSession(null);
          }
        }
      }, 5000); // 5 seconds timeout
      
      try {
        // Check if we have a token in localStorage first (fast path)
        const hasTokenInStorage = localStorage.getItem('sb-auth-token') || 
                                Object.keys(localStorage).some(key => 
                                  key.startsWith('supabase.auth.token'));
        
        if (!hasTokenInStorage) {
          console.log('No token in storage, skipping auth check');
          if (isMounted.current) {
            setUser(null);
            setProfile(null);
            setSession(null);
            setIsLoading(false);
            clearTimeout(authTimeoutRef.current!);
          }
          return;
        }
        
        // Check for existing session
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting initial session:', sessionError);
          setError(`Error getting session: ${sessionError.message}`);
          setIsLoading(false);
          return;
        }
        
        if (!isMounted.current) return;
        
        // Clear the timeout since we got a response
        if (authTimeoutRef.current) {
          clearTimeout(authTimeoutRef.current);
        }
        
        // Update session state with initial session
        setSession(data.session);
        
        if (data.session?.user) {
          console.log('User found in initial session:', data.session.user.id);
          setUser(data.session.user);
          
          // Fetch profile data for initial user (only if we don't already have it)
          if (!profile || profile.id !== data.session.user.id) {
            try {
              const profileData = await fetchProfile(data.session.user.id);
              
              if (!isMounted.current) return;
              
              if (profileData) {
                console.log('Profile data fetched on init');
                setProfile(profileData);
              } else {
                console.log('Using fallback profile on init');
                setProfile(createFallbackProfile(data.session.user));
              }
            } catch (profileError) {
              console.error('Error fetching initial profile:', profileError);
              if (isMounted.current) {
                setProfile(createFallbackProfile(data.session.user));
              }
            }
          }
        } else {
          console.log('No user found in initial session');
          // Clear the user state if no session is found
          setUser(null);
          setProfile(null);
        }
      } catch (error: any) {
        console.error('Exception during auth initialization:', error);
        if (isMounted.current) {
          setError(`Error during authentication initialization: ${error.message}`);
        }
      } finally {
        if (isMounted.current) {
          console.log('Auth initialization complete');
          setIsLoading(false);
        }
      }
    };

    initializeSession();
  }, []);
};
