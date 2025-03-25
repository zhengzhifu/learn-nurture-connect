
import { Profile } from '@/types/auth';
import { ServiceType, ServiceFilters, ServiceData } from '@/types/service';
import { Review } from '@/types/review';

// Re-export these types so they can be imported from this file
export { ServiceData, ServiceFilters };

// Define the ServiceClient interface
export interface ServiceClient {
  // Profile operations
  fetchUserProfile(userId: string): Promise<Profile | null>;
  updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null>;
  
  // Service operations
  getServices(): Promise<ServiceData[]>;
  filterServices(filters: ServiceFilters): Promise<ServiceData[]>;
  searchServices(query: string): Promise<ServiceData[]>;
  
  // Review operations
  getUserReviews(userId: string): Promise<Review[]>;
  addReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review>;
  deleteReview(reviewId: string): Promise<void>;
  updateReview(reviewId: string, updatedData: Partial<Review>): Promise<Review>;
}
