
import { Profile } from '@/types/auth';
import { ServiceClient, ServiceData, ServiceFilters } from './serviceClient';
import { realProfileService } from './realProfileService';
import { realServiceListingService } from './realServiceListingService';
import { Review } from '@/types/review';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  // Review operations
  async getUserReviews(userId: string): Promise<Review[]> {
    try {
      console.log('RealServiceClient: Fetching reviews for user:', userId);
      
      // Get reviews where the user is the reviewer
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          reviewee_id,
          reviewer_id,
          profiles!reviewee_id(full_name, avatar_url),
          bookings!booking_id(tutor_services!service_id(service_type, tutoring_subjects))
        `)
        .eq('reviewer_id', userId);
      
      if (error) {
        console.error('Error fetching reviews:', error);
        throw new Error(`Failed to fetch reviews: ${error.message}`);
      }
      
      // Transform the data to match our Review interface
      return (data || []).map(item => {
        // Extract values from the joined tables
        const tutorName = item.profiles?.full_name || 'Unknown Tutor';
        const tutorAvatar = item.profiles?.avatar_url || undefined;
        
        // Determine the subject
        let subject: string;
        if (item.bookings?.tutor_services?.service_type && 
            item.bookings?.tutor_services?.service_type.includes('tutoring') && 
            item.bookings?.tutor_services?.tutoring_subjects?.length > 0) {
          subject = item.bookings.tutor_services.tutoring_subjects[0];
        } else if (item.bookings?.tutor_services?.service_type) {
          subject = item.bookings.tutor_services.service_type;
        } else {
          subject = 'General';
        }
        
        return {
          id: item.id,
          rating: item.rating,
          content: item.comment,
          created_at: item.created_at,
          tutor_id: item.reviewee_id,
          user_id: item.reviewer_id,
          tutor_name: tutorName,
          tutor_avatar: tutorAvatar,
          subject: subject
        };
      });
    } catch (error: any) {
      console.error('Error in getUserReviews:', error);
      // Return empty array instead of throwing to prevent app from crashing
      return [];
    }
  }
  
  async addReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    try {
      console.log('RealServiceClient: Adding review:', review);
      
      // Insert the review into the database
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          reviewer_id: review.user_id,
          reviewee_id: review.tutor_id,
          rating: review.rating,
          comment: review.content
        })
        .select('*')
        .single();
      
      if (error) {
        console.error('Error adding review:', error);
        toast.error('Failed to add review');
        throw new Error(`Failed to add review: ${error.message}`);
      }
      
      // Return the created review
      return {
        id: data.id,
        tutor_id: data.reviewee_id,
        user_id: data.reviewer_id,
        rating: data.rating,
        content: data.comment,
        created_at: data.created_at,
        tutor_name: review.tutor_name,  // Use the provided tutor name
        tutor_avatar: review.tutor_avatar,
        subject: review.subject
      };
    } catch (error: any) {
      console.error('Error in addReview:', error);
      throw new Error(`Failed to add review: ${error.message}`);
    }
  }
  
  async deleteReview(reviewId: string): Promise<void> {
    try {
      console.log('RealServiceClient: Deleting review:', reviewId);
      
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
      
      if (error) {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review');
        throw new Error(`Failed to delete review: ${error.message}`);
      }
      
      toast.success('Review deleted successfully');
    } catch (error: any) {
      console.error('Error in deleteReview:', error);
      throw new Error(`Failed to delete review: ${error.message}`);
    }
  }
  
  async updateReview(reviewId: string, updatedData: Partial<Review>): Promise<Review> {
    try {
      console.log('RealServiceClient: Updating review:', reviewId, updatedData);
      
      // Extract only the fields that are relevant to the database
      const dbData: any = {};
      if (updatedData.rating !== undefined) dbData.rating = updatedData.rating;
      if (updatedData.content !== undefined) dbData.comment = updatedData.content;
      
      // Update the review in the database
      const { data, error } = await supabase
        .from('reviews')
        .update(dbData)
        .eq('id', reviewId)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error updating review:', error);
        toast.error('Failed to update review');
        throw new Error(`Failed to update review: ${error.message}`);
      }
      
      // Return the updated review
      return {
        id: data.id,
        tutor_id: data.reviewee_id,
        user_id: data.reviewer_id,
        rating: data.rating,
        content: data.comment,
        created_at: data.created_at,
        tutor_name: updatedData.tutor_name || 'Unknown Tutor',
        tutor_avatar: updatedData.tutor_avatar,
        subject: updatedData.subject || 'General'
      };
    } catch (error: any) {
      console.error('Error in updateReview:', error);
      throw new Error(`Failed to update review: ${error.message}`);
    }
  }
}

// Create an instance of the real client
export const realServiceClient = new RealServiceClient();
