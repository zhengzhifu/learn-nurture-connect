
import { Profile } from '@/types/auth';
import { profileFetchService } from './profileFetchService';
import { profileUpdateService } from './profileUpdateService';

/**
 * Main profile service that orchestrates profile operations
 */
export class ProfileService {
  /**
   * Fetches a user profile by ID
   */
  async fetchUserProfile(userId: string): Promise<Profile | null> {
    return profileFetchService.fetchUserProfile(userId);
  }
  
  /**
   * Updates a user profile by ID
   */
  async updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
    return profileUpdateService.updateUserProfile(userId, data);
  }
}

export const realProfileService = new ProfileService();
