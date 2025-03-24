
import { useState, useEffect, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { fetchProfile } from '@/services/auth';
import { createFallbackProfile } from '@/utils/profileUtils';
import { isTokenExpired } from '@/services/auth/sessionService';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear the auth timeout if component unmounts
  useEffect(() => {
    return () => {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      setError(null);
      
      // Set a timeout to prevent getting stuck in loading state
      authTimeoutRef.current = setTimeout(() => {
        if (isMounted && isLoading) {
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
        console.log('Initializing auth state...');
        
        // Check if we have a token in localStorage first (fast path)
        const hasTokenInStorage = localStorage.getItem('sb-auth-token') || 
                                 Object.keys(localStorage).some(key => 
                                   key.startsWith('supabase.auth.token'));
        
        if (!hasTokenInStorage) {
          console.log('No token in storage, skipping auth check');
          if (isMounted) {
            setUser(null);
            setProfile(null);
            setSession(null);
            setIsLoading(false);
            clearTimeout(authTimeoutRef.current!);
          }
          return;
        }
        
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log('Auth state changed:', event, 'User ID:', currentSession?.user?.id);
            
            if (!isMounted) return;
            
            // Clear the timeout since we got a response
            if (authTimeoutRef.current) {
              clearTimeout(authTimeoutRef.current);
            }
            
            // Update session state
            setSession(currentSession);
            
            if (currentSession?.user) {
              setUser(currentSession.user);
              
              // Only fetch profile if we have a user and don't already have a profile
              // This prevents unnecessary profile fetches on every auth state change
              if (!profile || profile.id !== currentSession.user.id) {
                try {
                  const profileData = await fetchProfile(currentSession.user.id);
                  if (isMounted) {
                    if (profileData) {
                      console.log('Profile data fetched on auth change');
                      setProfile(profileData);
                    } else {
                      console.log('Using fallback profile on auth change');
                      setProfile(createFallbackProfile(currentSession.user));
                    }
                  }
                } catch (profileError) {
                  console.error('Error fetching profile:', profileError);
                  if (isMounted) {
                    setProfile(createFallbackProfile(currentSession.user));
                  }
                }
              }
            } else if (event === 'SIGNED_OUT') {
              // Clear user and profile on sign out
              setUser(null);
              setProfile(null);
              console.log('User signed out, state cleared');
            }
            
            // Ensure loading state is updated
            if (isMounted) {
              setIsLoading(false);
            }
          }
        );
        
        // THEN check for existing session (only if we have a token)
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting initial session:', sessionError);
          setError(`Error getting session: ${sessionError.message}`);
          setIsLoading(false);
          return;
        }
        
        if (!isMounted) return;
        
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
              
              if (!isMounted) return;
              
              if (profileData) {
                console.log('Profile data fetched on init');
                setProfile(profileData);
              } else {
                console.log('Using fallback profile on init');
                setProfile(createFallbackProfile(data.session.user));
              }
            } catch (profileError) {
              console.error('Error fetching initial profile:', profileError);
              if (isMounted) {
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
        if (isMounted) {
          setError(`Error during authentication initialization: ${error.message}`);
        }
      } finally {
        if (isMounted) {
          console.log('Auth initialization complete');
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
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
