
// Service types
export type ServiceType = 'tutoring' | 'babysitting';

export interface ServiceSubject {
  id: string;
  name: string;
}

export interface ServiceAvailability {
  id: string;
  name: string;
}

import { Profile } from '@/types/auth';

// Service client interface that will be implemented by both mock and real clients
export interface ServiceClientInterface {
  // Profile operations
  fetchUserProfile(userId: string): Promise<Profile | null>;
  updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null>;
  
  // Add other service methods here as needed
}
