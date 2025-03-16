
import { ServiceClient } from './serviceClient';
import { Profile } from '@/types/auth';
import { toast } from 'sonner';

// Mock implementation for development and testing
class MockServiceClient implements ServiceClient {
  async fetchUserProfile(userId: string): Promise<Profile | null> {
    console.log('MockServiceClient: Fetching profile for user:', userId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock profile data
    return {
      id: userId,
      full_name: 'Mock User',
      email: 'mock@example.com',
      user_type: 'parent',
      phone: '123-456-7890',
      avatar_url: undefined,
      verified: true,
      school_name: 'Mock School',
      school_address: '123 School St, City',
      home_address: '456 Home St, City'
    };
  }
  
  async updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
    console.log('MockServiceClient: Updating profile for user:', userId, 'with data:', data);
    
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
    
    toast.success('Profile updated successfully (Mock)');
    return updatedProfile;
  }
}

// Create a singleton instance
export const mockServiceClient = new MockServiceClient();
