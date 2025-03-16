import { Profile } from '@/types/auth';

// Service client interface that will be implemented by both mock and real clients
export interface ServiceClient {
  // Profile operations
  fetchUserProfile(userId: string): Promise<Profile | null>;
  updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null>;
  
  // Add other service methods here as needed
}
