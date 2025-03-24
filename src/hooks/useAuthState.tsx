
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { fetchProfile } from '@/services/auth';
import { createFallbackProfile } from '@/utils/profileUtils';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Initializing auth state...');
        
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log('Auth state changed:', event, 'User ID:', currentSession?.user?.id);
            
            if (!isMounted) return;
            
            // Update session state
            setSession(currentSession);
            
            if (currentSession?.user) {
              setUser(currentSession.user);
              
              // Fetch profile data only if we have a user
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
        
        // THEN check for existing session
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting initial session:', sessionError);
          setError(`Error getting session: ${sessionError.message}`);
          setIsLoading(false);
          return;
        }
        
        if (!isMounted) return;
        
        // Update session state with initial session
        setSession(data.session);
        
        if (data.session?.user) {
          console.log('User found in initial session:', data.session.user.id);
          setUser(data.session.user);
          
          // Fetch profile data for initial user
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
        } else {
          console.log('No user found in initial session');
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
