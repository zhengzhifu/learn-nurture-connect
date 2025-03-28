
import { Profile } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createFallbackProfile } from '@/utils/profileUtils';

/**
 * Service for fetching user profiles
 */
export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('ProfileFetchService: Fetching profile for user:', userId);
    
    // Add a timeout to ensure the function doesn't hang indefinitely
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => reject(new Error('Profile fetch timed out')), 5000);
    });
    
    // Create the RPC promise
    const rpcPromise = async () => {
      console.log('ProfileFetchService: Starting RPC call at:', new Date().toISOString());
      
      const startTime = performance.now();
      const { data, error } = await supabase
        .rpc('get_current_user_profile')
        .maybeSingle();
      const endTime = performance.now();
      
      console.log(`ProfileFetchService: RPC call completed in ${(endTime - startTime).toFixed(2)}ms`);
        
      if (error) {
        console.error('ProfileFetchService: Error fetching profile via RPC:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // Fall back to direct query
        console.log('ProfileFetchService: Falling back to direct query at:', new Date().toISOString());
        const directStartTime = performance.now();
        const { data: directData, error: directError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        const directEndTime = performance.now();
        
        console.log(`ProfileFetchService: Direct query completed in ${(directEndTime - directStartTime).toFixed(2)}ms`);
          
        if (directError) {
          console.error('ProfileFetchService: Error in direct profile query:', directError);
          return null;
        }
        
        if (directData) {
          // Add full_name for backward compatibility
          const profile: Profile = {
            ...directData,
            full_name: `${directData.first_name || ''} ${directData.last_name || ''}`.trim()
          };
          
          console.log('ProfileFetchService: Profile fetched via direct query:', profile);
          console.log('ProfileFetchService: Approval status:', profile.approval_status);
          return profile;
        }
        
        return null;
      }

      if (!data) {
        console.log('ProfileFetchService: No profile found, will create one on demand');
        return null;
      }

      // Add full_name for backward compatibility
      const profile: Profile = {
        ...data,
        full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim()
      };
      
      console.log('ProfileFetchService: Profile data fetched via RPC:', profile);
      console.log('ProfileFetchService: Approval status:', profile.approval_status);
      return profile;
    };

    // Race the fetch against the timeout
    console.log('ProfileFetchService: Starting race between RPC and timeout at:', new Date().toISOString());
    const profile = await Promise.race([rpcPromise(), timeoutPromise]);
    console.log('ProfileFetchService: Race completed at:', new Date().toISOString());
    return profile;
  } catch (error: any) {
    console.error('ProfileFetchService: Exception fetching profile:', error);
    // Make sure we always return null on error, don't leave promises hanging
    return null;
  }
};
