
import { Profile } from '@/types/auth';
import { mockProfiles, mockSchools } from './mockData';
import { toast } from 'sonner';

// Class to provide mock profile service
export class MockProfileService {
  fetchUserProfile(userId: string): Promise<Profile | null> {
    return new Promise((resolve) => {
      console.log('MockProfileService: Fetching profile for user:', userId);
      
      // Simulate network delay
      setTimeout(() => {
        const profile = mockProfiles.find(p => p.id === userId);
        console.log('MockProfileService: Profile fetched:', profile);
        resolve(profile || null);
      }, 500);
    });
  }
  
  updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile> {
    return new Promise((resolve, reject) => {
      console.log('MockProfileService: Updating profile for user:', userId, data);
      
      // Simulate network delay
      setTimeout(() => {
        try {
          // Check if profile exists
          let profile = mockProfiles.find(p => p.id === userId);
          
          if (!profile) {
            // Create new profile if it doesn't exist
            profile = {
              id: userId,
              full_name: data.full_name || 'New User',
              email: data.email || 'user@example.com',
              user_type: data.user_type || 'parent',
              home_address: data.home_address || '',
              approval_status: 'pending',
              school_id: data.school_id,
              other_school_name: data.other_school_name,
              child_school_id: data.child_school_id
            };
            
            mockProfiles.push(profile);
            toast.success('Profile created successfully');
          } else {
            // Update existing profile
            Object.assign(profile, data);
            toast.success('Profile updated successfully');
          }
          
          console.log('MockProfileService: Profile updated:', profile);
          resolve({ ...profile });
        } catch (error) {
          console.error('MockProfileService: Error updating profile:', error);
          reject(new Error('Failed to update profile'));
        }
      }, 800);
    });
  }
}

export const mockProfileService = new MockProfileService();
