
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { createFallbackProfile } from '@/utils/profileUtils';

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
          
          // Fetch user profile, using the supabase client that automatically includes API key
          try {
            const { data, error: profileError } = await supabase
              .from('profiles')
              .select('id, full_name, email, user_type, avatar_url, verified, phone, school_name, school_address, home_address')
              .eq('id', session.user.id)
              .maybeSingle();
              
            if (profileError) {
              console.error('Error fetching profile directly:', profileError);
              // Fall back to user metadata if profile fetch fails
              setProfile(createFallbackProfile(session.user));
            } else if (data) {
              console.log('Profile data fetched directly:', data);
              setProfile(data as Profile);
            } else {
              console.log('No profile found, using fallback');
              setProfile(createFallbackProfile(session.user));
            }
          } catch (profileError: any) {
            console.error('Exception fetching profile directly:', profileError);
            // Still use fallback on error
            setProfile(createFallbackProfile(session.user));
          }
        } else {
          console.log('No user found in session');
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
          try {
            // Direct query using supabase client (includes API key)
            const { data, error: profileError } = await supabase
              .from('profiles')
              .select('id, full_name, email, user_type, avatar_url, verified, phone, school_name, school_address, home_address')
              .eq('id', session.user.id)
              .maybeSingle();
              
            if (profileError) {
              console.error('Error fetching profile on auth change:', profileError);
              setProfile(createFallbackProfile(session.user));
            } else if (data) {
              console.log('Profile data fetched on auth change:', data);
              setProfile(data as Profile);
            } else {
              console.log('No profile found on auth change, using fallback');
              setProfile(createFallbackProfile(session.user));
            }
          } catch (profileError: any) {
            console.error('Exception fetching profile on auth change:', profileError);
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
