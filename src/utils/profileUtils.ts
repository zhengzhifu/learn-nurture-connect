
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { User } from '@supabase/supabase-js';

// Fetch user profile data from Supabase
export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('Fetching profile for user:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    console.log('Profile data fetched:', data);
    return data as Profile;
  } catch (error: any) {
    console.error('Exception fetching profile:', error);
    return null;
  }
};

// Create a fallback profile based on user metadata if actual profile fetching fails
export const createFallbackProfile = (user: User | null): Profile | null => {
  if (!user) return null;
  
  const metadata = user.user_metadata;
  return {
    id: user.id,
    full_name: metadata?.full_name || metadata?.name || 'User',
    email: user.email || metadata?.email || '',
    user_type: (metadata?.role as any) || 'parent',
    verified: !!user.email_confirmed_at,
  };
};
