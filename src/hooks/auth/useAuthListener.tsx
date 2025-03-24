
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { fetchProfile } from '@/services/auth';
import { createFallbackProfile } from '@/utils/profileUtils';

/**
 * Hook that sets up the Supabase auth state listener
 * Responds to authentication events like sign-in and sign-out
 */
export const useAuthListener = (
  isMounted: React.MutableRefObject<boolean>,
  setUser: (user: import('@supabase/supabase-js').User | null) => void,
  setSession: (session: import('@supabase/supabase-js').Session | null) => void,
  setProfile: (profile: Profile | null) => void,
  profile: Profile | null,
  authTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  setIsLoading: (isLoading: boolean) => void
) => {
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, 'User ID:', currentSession?.user?.id);
        
        if (!isMounted.current) return;
        
        // Clear the timeout since we got a response
        if (authTimeoutRef.current) {
          clearTimeout(authTimeoutRef.current);
        }
        
        // Update session state
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          
          // Only fetch profile if we have a user and don't already have a profile
          if (!profile || profile.id !== currentSession.user.id) {
            try {
              const profileData = await fetchProfile(currentSession.user.id);
              if (isMounted.current) {
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
              if (isMounted.current) {
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
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
};
