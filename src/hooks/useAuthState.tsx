
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { fetchProfile } from '@/services/auth';
import { createFallbackProfile } from '@/utils/profileUtils';
import { toast } from 'sonner';

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
        console.log('Initializing auth...');
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError(`Error getting session: ${sessionError.message}`);
          setIsLoading(false);
          return;
        }
        
        if (!isMounted) return;
        setSession(session);
        
        if (session?.user) {
          console.log('User found in session:', session.user.id);
          setUser(session.user);
          
          // Fetch profile data
          try {
            const profileData = await fetchProfile(session.user.id);
            
            if (!isMounted) return;
            
            if (profileData) {
              console.log('Profile data fetched:', profileData);
              setProfile(profileData);
            } else {
              console.log('Using fallback profile from user metadata');
              const fallbackProfile = createFallbackProfile(session.user);
              setProfile(fallbackProfile);
            }
          } catch (profileError: any) {
            console.error('Error fetching profile:', profileError);
            // Still keep the user logged in but with fallback profile
            const fallbackProfile = createFallbackProfile(session.user);
            if (isMounted) setProfile(fallbackProfile);
          }
        } else {
          console.log('No user found in session');
          if (isMounted) {
            setUser(null);
            setProfile(null);
          }
        }
      } catch (error: any) {
        console.error('Exception during auth initialization:', error);
        if (isMounted) {
          setError(`Error during authentication initialization: ${error.message}`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, 'User ID:', session?.user?.id);
        
        if (!isMounted) return;
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setSession(null);
          console.log('User signed out, state cleared');
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(session);
          
          if (session?.user) {
            setUser(session.user);
            
            try {
              const profileData = await fetchProfile(session.user.id);
              
              if (!isMounted) return;
              
              if (profileData) {
                console.log('Profile data fetched on auth change:', profileData);
                setProfile(profileData);
              } else {
                console.log('Using fallback profile on auth change');
                const fallbackProfile = createFallbackProfile(session.user);
                setProfile(fallbackProfile);
              }
            } catch (error) {
              console.error('Error fetching profile on auth change:', error);
              // Still keep user signed in with fallback profile
              if (isMounted) {
                const fallbackProfile = createFallbackProfile(session.user);
                setProfile(fallbackProfile);
              }
            }
          }
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
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
