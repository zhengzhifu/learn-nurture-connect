
import { Profile } from '@/types/auth';
import { generateMockProfile } from './mockData';
import { toast } from 'sonner';

export class MockProfileService {
  async fetchUserProfile(userId: string): Promise<Profile | null> {
    console.log('MockProfileService: fetchUserProfile called with userId:', userId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = generateMockProfile(userId);
    
    console.log('MockProfileService: fetchUserProfile returning:', result);
    return result;
  }
  
  async updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
    console.log('MockProfileService: updateUserProfile called with userId:', userId, 'and data:', data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create updated profile by merging input data
    const updatedProfile: Profile = {
      id: userId,
      full_name: data.full_name || 'Mock User',
      email: 'mock@example.com', // Email can't be changed
      user_type: 'parent',
      phone: data.phone || '123-456-7890',
      avatar_url: data.avatar_url,
      verified: true,
      school_name: data.school_name || 'Mock School',
      school_address: data.school_address || '123 School St, City',
      home_address: data.home_address || '456 Home St, City'
    };
    
    console.log('MockProfileService: updateUserProfile returning:', updatedProfile);
    toast.success('Profile updated successfully (Mock)');
    return updatedProfile;
  }
}
