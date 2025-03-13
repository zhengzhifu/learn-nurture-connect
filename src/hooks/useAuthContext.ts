
import { User } from '@supabase/supabase-js';
import { UserRole, Profile } from '@/contexts/AuthContext';

export const useAuth = () => {
  // Create a fallback profile based on user metadata if actual profile fetching fails
  const createFallbackProfile = (user: User | null): Profile | null => {
    if (!user) return null;
    
    const metadata = user.user_metadata;
    return {
      id: user.id,
      full_name: metadata?.full_name || metadata?.name || 'User',
      email: user.email || metadata?.email || '',
      user_type: (metadata?.role as UserRole) || 'parent',
      verified: !!user.email_confirmed_at,
    };
  };

  const user = {
    id: 'authenticated-user',
    email: 'user@example.com',
    user_metadata: {
      full_name: 'Authenticated User',
      role: 'parent'
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: '',
  } as User;

  return {
    isAuthenticated: true,
    isLoading: false,
    error: null,
    user: user,
    profile: createFallbackProfile(user),
    signIn: () => Promise.resolve(),
    signUp: () => Promise.resolve(),
    signOut: () => Promise.resolve(),
    updateProfile: () => Promise.resolve(),
  };
};
