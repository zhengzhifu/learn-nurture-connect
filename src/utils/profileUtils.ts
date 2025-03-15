
import { Profile } from '@/types/auth';
import { User } from '@supabase/supabase-js';

// Create a fallback profile based on user metadata if actual profile fetching fails
export const createFallbackProfile = (user: User | null): Profile | null => {
  if (!user) return null;
  
  console.log('Creating fallback profile from user metadata:', user.id);
  
  const metadata = user.user_metadata;
  return {
    id: user.id,
    full_name: metadata?.full_name || metadata?.name || 'User',
    email: user.email || metadata?.email || '',
    user_type: (metadata?.role as any) || 'parent',
    verified: !!user.email_confirmed_at,
  };
};
