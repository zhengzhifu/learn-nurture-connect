
import { Profile } from '@/types/auth';
import { toast } from 'sonner';
import { BaseService } from '../base/BaseService';

/**
 * Service responsible for fetching user profiles
 */
export class ProfileFetchService extends BaseService {
  /**
   * Fetches a user profile by ID
   */
  async fetchUserProfile(userId: string): Promise<Profile | null> {
    try {
      console.log('ProfileFetchService: fetchUserProfile called with userId:', userId);
      
      const { data, error } = await this.supabase
        .from('profiles')
        .select('id, first_name, last_name, email, user_type, avatar_url, phone, home_address, approval_status, school_id, latitude, longitude')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile from Supabase:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        return null;
      }

      if (!data) {
        console.log('No profile found for user ID:', userId);
        return null;
      }

      // Create a valid Profile object from the data
      const profile: Profile = {
        id: data.id || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        user_type: data.user_type || 'parent',
        phone: data.phone || '',
        avatar_url: data.avatar_url || '',
        home_address: data.home_address || '',
        approval_status: data.approval_status || 'pending',
        school_id: data.school_id || '',
        latitude: data.latitude,
        longitude: data.longitude,
        // Add empty strings for fields that might not exist in the database
        other_school_name: '',
        verified: false,
        // Add derived full_name for backward compatibility
        full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim()
      };
      
      console.log('ProfileFetchService: fetchUserProfile returning:', profile);
      return profile;
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return null;
    }
  }
}

export const profileFetchService = new ProfileFetchService();
