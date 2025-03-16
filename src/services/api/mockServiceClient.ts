
import { ServiceClient, ServiceData, ServiceFilters } from './serviceClient';
import { Profile } from '@/types/auth';
import { MockProfileService } from './mockProfileService';
import { MockServiceListingService } from './mockServiceListingService';

// Mock implementation for development and testing
class MockServiceClient implements ServiceClient {
  private profileService: MockProfileService;
  private serviceListingService: MockServiceListingService;
  
  constructor() {
    this.profileService = new MockProfileService();
    this.serviceListingService = new MockServiceListingService();
  }

  // Profile operations
  async fetchUserProfile(userId: string): Promise<Profile | null> {
    return this.profileService.fetchUserProfile(userId);
  }
  
  async updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
    return this.profileService.updateUserProfile(userId, data);
  }

  // Service listing operations
  async getServices(): Promise<ServiceData[]> {
    return this.serviceListingService.getServices();
  }
  
  async filterServices(filters: ServiceFilters): Promise<ServiceData[]> {
    return this.serviceListingService.filterServices(filters);
  }
  
  async searchServices(query: string): Promise<ServiceData[]> {
    return this.serviceListingService.searchServices(query);
  }
}

// Create a singleton instance
export const mockServiceClient = new MockServiceClient();
