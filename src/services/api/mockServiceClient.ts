
import { ServiceClient, ServiceData, ServiceFilters } from './serviceClient';
import { Profile } from '@/types/auth';
import { Review } from '@/types/review';
import { MockProfileService } from './mockProfileService';
import { MockServiceListingService } from './mockServiceListingService';
import { MockReviewService } from './mockReviewService';

// Mock implementation for development and testing
class MockServiceClient implements ServiceClient {
  private profileService: MockProfileService;
  private serviceListingService: MockServiceListingService;
  private reviewService: MockReviewService;
  
  constructor() {
    this.profileService = new MockProfileService();
    this.serviceListingService = new MockServiceListingService();
    this.reviewService = new MockReviewService();
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
  
  // Review operations
  async getUserReviews(userId: string): Promise<Review[]> {
    return this.reviewService.getUserReviews(userId);
  }
  
  async addReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    return this.reviewService.addReview(review);
  }
  
  async deleteReview(reviewId: string): Promise<void> {
    return this.reviewService.deleteReview(reviewId);
  }
  
  async updateReview(reviewId: string, updatedData: Partial<Review>): Promise<Review> {
    return this.reviewService.updateReview(reviewId, updatedData);
  }
}

// Create a singleton instance
export const mockServiceClient = new MockServiceClient();
