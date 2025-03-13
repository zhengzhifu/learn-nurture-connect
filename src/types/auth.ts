
// Auth-related types
export type UserRole = 'parent' | 'tutor' | 'admin' | null;

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  user_type: UserRole;
  phone?: string;
  avatar_url?: string;
  verified?: boolean;
  school_name?: string;
  school_address?: string;
  home_address?: string;
}

export interface AuthContextType {
  user: import('@supabase/supabase-js').User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}
