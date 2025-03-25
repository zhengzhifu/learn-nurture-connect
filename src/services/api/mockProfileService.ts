
import { Profile, UserRole } from '@/types/auth';

// Mock profiles for testing
const mockProfiles: Profile[] = [
  {
    id: 'user-1',
    first_name: 'John',
    last_name: 'Doe',
    full_name: 'John Doe', 
    email: 'john.doe@example.com',
    user_type: 'parent' as UserRole,
    phone: '+1234567890',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop',
    verified: true,
    home_address: '123 Main St, Anytown, USA',
    approval_status: 'approved',
    school_id: 'school-1',
    other_school_name: '',
    child_school_id: 'school-2'
  },
  {
    id: 'user-2',
    first_name: 'Jane',
    last_name: 'Smith',
    full_name: 'Jane Smith',
    email: 'jane.smith@example.com',
    user_type: 'tutor' as UserRole,
    phone: '+1987654321',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop',
    verified: true,
    home_address: '456 Elm St, Othertown, USA',
    approval_status: 'approved',
    school_id: 'school-3',
    other_school_name: '',
    child_school_id: ''
  },
];

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
