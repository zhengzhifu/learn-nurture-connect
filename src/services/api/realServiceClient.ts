
import { Profile } from '@/types/auth';
import { ServiceClient, ServiceData, ServiceFilters } from './serviceClient';
import { realProfileService } from './realProfileService';
import { realServiceListingService } from './realServiceListingService';

// Real implementation using Supabase
export class RealServiceClient implements ServiceClient {
  // Profile operations
  async fetchUserProfile(userId: string): Promise<Profile | null> {
    return realProfileService.fetchUserProfile(userId);
  }
  
  async updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
    return realProfileService.updateUserProfile(userId, data);
  }

  // Service listing operations
  async getServices(): Promise<ServiceData[]> {
    return realServiceListingService.getServices();
  }
  
  async filterServices(filters: ServiceFilters): Promise<ServiceData[]> {
    return realServiceListingService.filterServices(filters);
  }
  
  async searchServices(query: string): Promise<ServiceData[]> {
    return realServiceListingService.searchServices(query);
  }
}

// Create an instance of the real client
export const realServiceClient = new RealServiceClient();
