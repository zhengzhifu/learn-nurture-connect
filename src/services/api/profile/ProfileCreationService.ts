
import { ProfileServiceBase } from './ProfileServiceBase';
import { Profile } from '@/types/auth';
import { toast } from 'sonner';

/**
 * Service responsible for creating new user profiles
 */
export class ProfileCreationService extends ProfileServiceBase {
  /**
   * Creates a new profile when one doesn't exist
   */
  async createNewProfile(userId: string, user: any, data: Partial<Profile>): Promise<Profile | null> {
    console.log('ProfileCreationService: Creating a new profile');
        
    // Split full_name into first_name and last_name if provided
    let firstName = data.first_name;
    let lastName = data.last_name;
    
    if (!firstName && !lastName && data.full_name) {
      const parts = data.full_name.split(' ');
      firstName = parts[0];
      lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
    }
    
    // Prepare profile data from user metadata and input data
    const profileData = {
      id: userId,
      first_name: firstName || user.user_metadata?.first_name || 'User',
      last_name: lastName || user.user_metadata?.last_name || '',
      email: user.email || '',
      user_type: data.user_type || user.user_metadata?.role || 'parent',
      phone: data.phone || '',
      avatar_url: data.avatar_url || '',
      home_address: data.home_address || '',
      school_id: data.school_id || null,
      latitude: data.latitude,
      longitude: data.longitude
    };
    
    console.log('ProfileCreationService: Creating profile with data:', profileData);
    
    try {
      // Create profile
      const { data: newProfile, error: insertError } = await this.supabase
        .from('profiles')
        .insert(profileData)
        .select('*')
        .single();
        
      if (insertError) {
        return this.handleProfileError(insertError, 'creating');
      }
      
      if (!newProfile) {
        throw new Error('Failed to create profile: No data returned');
      }
      
      const profile = this.standardizeProfile(newProfile);
      
      console.log('ProfileCreationService: Created new profile:', profile);
      toast.success('Profile created successfully');
      return profile;
    } catch (error) {
      return this.handleProfileError(error, 'creating');
    }
  }
}

export const profileCreationService = new ProfileCreationService();
