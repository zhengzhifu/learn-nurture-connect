
import { User } from '@supabase/supabase-js';
import { Profile, UserRole } from '@/types/auth';

/**
 * Create a fallback profile when one can't be fetched from the database
 */
export const createFallbackProfile = (user: User): Profile => {
  // Extract first and last name from metadata
  let firstName = user?.user_metadata?.first_name || '';
  let lastName = user?.user_metadata?.last_name || '';
  
  // If we have no names at all, use "User" as default first name
  if (!firstName && !lastName) {
    firstName = 'User';
  }
  
  // Get user type from metadata, fallback to 'parent' if not found
  const userType = (user?.user_metadata?.user_type || 
                   user?.user_metadata?.role) as UserRole || 'parent';
  
  // Create a virtual full_name for backward compatibility
  const generatedFullName = `${firstName} ${lastName}`.trim();
  
  return {
    id: user.id,
    first_name: firstName,
    last_name: lastName,
    full_name: generatedFullName,
    email: user.email || '',
    user_type: userType,
    avatar_url: user?.user_metadata?.avatar_url || '',
    verified: false,
  };
};

/**
 * Create a display name from first and last name, or fallback
 */
export const getDisplayName = (profile: Profile | null): string => {
  if (!profile) return 'User';
  
  // If the profile has first_name and last_name, construct full name
  if (profile.first_name || profile.last_name) {
    return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  }
  
  // Last resort, use email or ID
  return profile.email || profile.id.substring(0, 8) || 'User';
};
