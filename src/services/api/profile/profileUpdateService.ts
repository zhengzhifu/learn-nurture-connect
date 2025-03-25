
import { Profile } from '@/types/auth';
import { ProfileServiceBase } from './ProfileServiceBase';
import { profileCreationService } from './ProfileCreationService';
import { profileModificationService } from './ProfileModificationService';

/**
 * Service responsible for updating user profiles
 */
export class ProfileUpdateService extends ProfileServiceBase {
  /**
   * Updates a user profile by ID
   */
  async updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
    try {
      console.log('ProfileUpdateService: updateUserProfile called with userId:', userId);
      
      // First check if we can get the current user data
      const { data: userData, error: userError } = await this.supabase.auth.getUser();
      if (userError || !userData.user) {
        console.error('Error getting current user:', userError);
        throw new Error('Authentication error: No valid session found');
      }
      
      console.log('ProfileUpdateService: Current user from auth:', userData.user);
      
      // Check if the profile exists first
      console.log('ProfileUpdateService: Checking if profile exists for user ID:', userId);
      const { data: existingProfile, error: checkError } = await this.supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
        
      if (checkError) {
        return this.handleProfileError(checkError, 'verifying');
      }
      
      if (!existingProfile) {
        // Profile doesn't exist, create a new one
        return await profileCreationService.createNewProfile(userId, userData.user, data);
      }
      
      // Profile exists, update it
      return await profileModificationService.updateExistingProfile(userId, data);
    } catch (error: any) {
      return this.handleProfileError(error, 'updating');
    }
  }
}

export const profileUpdateService = new ProfileUpdateService();
