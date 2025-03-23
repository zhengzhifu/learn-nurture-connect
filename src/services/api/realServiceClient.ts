
import { Profile } from '@/types/auth';
import { ServiceClient, ServiceData, ServiceFilters } from './serviceClient';
import { realProfileService } from './realProfileService';
import { realServiceListingService } from './realServiceListingService';
import { Review } from '@/types/review';
import { realReviewService } from './implementations/RealReviewService';
import { BaseService } from './base/BaseService';

// Real implementation using Supabase
export class RealServiceClient extends BaseService implements ServiceClient {
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

  // Review operations
  async getUserReviews(userId: string): Promise<Review[]> {
    return realReviewService.getUserReviews(userId);
  }
  
  async addReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    return realReviewService.addReview(review);
  }
  
  async deleteReview(reviewId: string): Promise<void> {
    return realReviewService.deleteReview(reviewId);
  }
  
  async updateReview(reviewId: string, updatedData: Partial<Review>): Promise<Review> {
    return realReviewService.updateReview(reviewId, updatedData);
  }
}

// Create an instance of the real client
export const realServiceClient = new RealServiceClient();
