
import { Profile } from '@/types/auth';
import { mockProfiles } from './mockData';

export class MockProfileService {
  private profiles: Profile[] = mockProfiles;

  async fetchUserProfile(userId: string): Promise<Profile | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user profile by ID
    const profile = this.profiles.find(p => p.id === userId);
    
    // If profile found return it, otherwise return null
    return profile ? { ...profile } : null;
  }
  
  async updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find user profile index
    const profileIndex = this.profiles.findIndex(p => p.id === userId);
    
    if (profileIndex === -1) {
      // Create a new profile if it doesn't exist
      const newProfile: Profile = {
        id: userId,
        first_name: data.first_name || 'New',
        last_name: data.last_name || 'User',
        full_name: data.full_name || `${data.first_name || 'New'} ${data.last_name || 'User'}`,
        email: data.email || 'user@example.com',
        user_type: data.user_type || 'parent',
        home_address: data.home_address || '',
        approval_status: data.approval_status || 'pending',
        school_id: data.school_id || '',
        other_school_name: data.other_school_name || '',
        child_school_id: data.child_school_id || '',
        verified: false
      };
      
      this.profiles.push(newProfile);
      return { ...newProfile };
    }
    
    // Update existing profile
    this.profiles[profileIndex] = {
      ...this.profiles[profileIndex],
      ...data,
      // Make sure full_name is updated if first_name or last_name changes
      full_name: data.full_name || data.first_name || data.last_name 
        ? `${data.first_name || this.profiles[profileIndex].first_name} ${data.last_name || this.profiles[profileIndex].last_name}`
        : this.profiles[profileIndex].full_name
    };
    
    return { ...this.profiles[profileIndex] };
  }
}

export const mockProfileService = new MockProfileService();
