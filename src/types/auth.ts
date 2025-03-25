// Auth-related types
export type UserRole = 'parent' | 'tutor' | 'admin' | 'child' | null;
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | string;

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: UserRole;
  phone?: string;
  avatar_url?: string;
  verified?: boolean;
  home_address?: string;
  approval_status?: ApprovalStatus;
  school_id?: string;
  other_school_name?: string;
  
  // Virtual property for backward compatibility
  full_name?: string;
}

export interface ParentProfile {
  id: string;
  num_children: number;
  preferred_communication: string;
}

export interface AuthContextType {
  user: import('@supabase/supabase-js').User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole, firstName: string, lastName: string) => Promise<void>;
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
  tutor_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface Specialty {
  id: string;
  tutor_id: string;
  specialty_type: string;
  specialty_name: string;
  created_at: string;
}

// Extension of Profile for Tutor-specific data
export interface Tutor extends Profile {
  subjects?: string[];
  hourlyRate?: number; 
  rating?: number;
  reviewCount?: number;
  availability?: string[];
  bio?: string;
  isBookmarked?: boolean;
}
