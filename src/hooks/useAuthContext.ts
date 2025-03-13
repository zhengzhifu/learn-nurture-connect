
import { User } from '@supabase/supabase-js';
import { UserRole, Profile } from '@/types/auth';
import { createFallbackProfile } from '@/utils/profileUtils';

// This is a mock hook for testing or development purposes
export const useAuth = () => {
  // Create a mock user
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
