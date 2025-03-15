
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { fetchProfile, createFallbackProfile } from '@/utils/profileUtils';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
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
        
        setSession(session);
        
        if (session?.user) {
          console.log('User found in session:', session.user.id);
          setUser(session.user);
          
          // Use the fetchProfile utility function which uses the supabase client with API key headers
          const profileData = await fetchProfile(session.user.id);
          
          if (profileData) {
            console.log('Profile data fetched:', profileData);
            setProfile(profileData);
          } else {
            console.log('Using fallback profile from user metadata');
            setProfile(createFallbackProfile(session.user));
          }
        } else {
          console.log('No user found in session');
          setUser(null);
          setProfile(null);
        }
      } catch (error: any) {
        console.error('Exception during auth initialization:', error);
        setError(`Exception during auth initialization: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, 'User ID:', session?.user?.id);
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          // Use the fetchProfile utility function
          const profileData = await fetchProfile(session.user.id);
          
          if (profileData) {
            console.log('Profile data fetched on auth change:', profileData);
            setProfile(profileData);
          } else {
            console.log('Using fallback profile on auth change');
            setProfile(createFallbackProfile(session.user));
          }
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
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
