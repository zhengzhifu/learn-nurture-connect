
// Auth-related types
export type UserRole = 'parent' | 'tutor' | 'admin' | null;
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

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
  approval_status?: ApprovalStatus;
  school_id?: string;
  other_school_name?: string;
  child_school_id?: string;
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

export interface School {
  id: string;
  name: string;
  address?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Availability {
  id: string;
  user_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface Specialty {
  id: string;
  user_id: string;
  specialty_type: string;
  specialty_name: string;
  created_at: string;
}
