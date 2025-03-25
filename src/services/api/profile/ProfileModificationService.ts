
import { ProfileServiceBase } from './ProfileServiceBase';
import { Profile } from '@/types/auth';
import { toast } from 'sonner';

/**
 * Service responsible for updating existing user profiles
 */
export class ProfileModificationService extends ProfileServiceBase {
  /**
   * Updates an existing profile
   */
  async updateExistingProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
    try {
      // Prepare update data
      const updateData: any = { ...data };
      
      // Split full_name into first_name and last_name if provided
      if (!updateData.first_name && !updateData.last_name && updateData.full_name) {
        const parts = updateData.full_name.split(' ');
        updateData.first_name = parts[0];
        updateData.last_name = parts.length > 1 ? parts.slice(1).join(' ') : '';
        // Remove full_name as it's not in the database
        delete updateData.full_name;
      }
      
      // Remove fields that don't exist in the database
      if ('verified' in updateData) {
        delete updateData.verified;
      }
      if ('other_school_name' in updateData) {
        delete updateData.other_school_name;
      }
      
      // Proceed with the update
      console.log('ProfileModificationService: Updating profile with data:', updateData);
      const { data: updatedData, error } = await this.supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select('*')
        .single();
      
      if (error) {
        return this.handleProfileError(error, 'updating');
      }
      
      if (!updatedData) {
        throw new Error('Failed to update profile: No data returned');
      }
      
      const profile = this.standardizeProfile(updatedData);
      
      console.log('ProfileModificationService: Profile updated successfully:', profile);
      toast.success('Profile updated successfully');
      return profile;
    } catch (error) {
      return this.handleProfileError(error, 'updating');
    }
  }
}

export const profileModificationService = new ProfileModificationService();
