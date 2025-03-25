
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types/review';
import { getDisplayName } from '@/utils/profileUtils';
import { BaseService } from '../base/BaseService';

export class RealReviewService extends BaseService {
  async getUserReviews(userId: string): Promise<Review[]> {
    try {
      // Fetch reviews where this user is the reviewee
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviewer_id(id, first_name, last_name, avatar_url)
        `)
        .eq('reviewee_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        return [];
      }

      // Map the Supabase response to our Review interface
      return data.map(review => {
        const reviewer = review.reviewer || {};
        
        // Generate name from first_name and last_name with null checks
        const first_name = reviewer.first_name || '';
        const last_name = reviewer.last_name || '';
        const reviewerName = first_name || last_name 
          ? `${first_name} ${last_name}`.trim()
          : 'Anonymous';
        
        return {
          id: review.id,
          reviewer_id: review.reviewer_id,
          reviewee_id: review.reviewee_id,
          rating: review.rating,
          comment: review.comment || '',
          created_at: review.created_at,
          subject: review.subject || '',
          
          // Add legacy fields for backward compatibility
          content: review.comment || '',
          tutor_id: review.reviewee_id,
          user_id: review.reviewer_id,
          tutor_name: reviewerName,
          tutor_avatar: reviewer.avatar_url || '',
          
          // New field names
          reviewer_name: reviewerName,
          reviewer_avatar: reviewer.avatar_url || '',
        };
      });
    } catch (error) {
      console.error('Error in getUserReviews:', error);
      return [];
    }
  }

  async addReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    try {
      // Insert the review into the database
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          reviewer_id: review.reviewer_id,
          reviewee_id: review.reviewee_id,
          rating: review.rating,
          comment: review.comment || '',
          subject: review.subject || 'General'
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding review:', error);
        throw new Error(`Failed to add review: ${error.message}`);
      }

      // Fetch reviewer profile for the response
      const { data: reviewerData, error: reviewerError } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', review.reviewer_id)
        .single();

      if (reviewerError) {
        console.error('Error fetching reviewer profile:', reviewerError);
      }

      // Generate full name from first_name and last_name
      const first_name = reviewerData?.first_name || '';
      const last_name = reviewerData?.last_name || '';
      const reviewerName = first_name || last_name 
        ? `${first_name} ${last_name}`.trim()
        : 'Anonymous';

      const result: Review = {
        id: data.id,
        reviewer_id: data.reviewer_id,
        reviewee_id: data.reviewee_id,
        rating: data.rating,
        comment: data.comment || '',
        created_at: data.created_at,
        subject: data.subject || 'General',
        reviewer_name: reviewerName,
        reviewer_avatar: reviewerData?.avatar_url || '',
        // Add legacy fields
        content: data.comment || '',
        tutor_id: data.reviewee_id,
        user_id: data.reviewer_id,
        tutor_name: reviewerName,
        tutor_avatar: reviewerData?.avatar_url || '',
      };

      return result;
    } catch (error: any) {
      console.error('Error in addReview:', error);
      throw new Error(`Failed to add review: ${error.message}`);
    }
  }

  async deleteReview(reviewId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) {
        console.error('Error deleting review:', error);
        throw new Error(`Failed to delete review: ${error.message}`);
      }
    } catch (error: any) {
      console.error('Error in deleteReview:', error);
      throw new Error(`Failed to delete review: ${error.message}`);
    }
  }

  async updateReview(reviewId: string, updatedData: Partial<Review>): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          rating: updatedData.rating,
          comment: updatedData.comment || '',
          subject: updatedData.subject || 'General'
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) {
        console.error('Error updating review:', error);
        throw new Error(`Failed to update review: ${error.message}`);
      }

      // Fetch reviewer profile for the response
      const { data: reviewerData, error: reviewerError } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', data.reviewer_id)
        .single();

      if (reviewerError) {
        console.error('Error fetching reviewer profile:', reviewerError);
      }

      // Generate full name from first_name and last_name
      const first_name = reviewerData?.first_name || '';
      const last_name = reviewerData?.last_name || '';
      const reviewerName = first_name || last_name 
        ? `${first_name} ${last_name}`.trim()
        : 'Anonymous';

      const result: Review = {
        id: data.id,
        reviewer_id: data.reviewer_id,
        reviewee_id: data.reviewee_id,
        rating: data.rating,
        comment: data.comment || '',
        created_at: data.created_at,
        subject: data.subject || 'General',
        reviewer_name: reviewerName,
        reviewer_avatar: reviewerData?.avatar_url || '',
        // Add legacy fields
        content: data.comment || '',
        tutor_id: data.reviewee_id,
        user_id: data.reviewer_id,
        tutor_name: reviewerName,
        tutor_avatar: reviewerData?.avatar_url || '',
      };

      return result;
    } catch (error: any) {
      console.error('Error in updateReview:', error);
      throw new Error(`Failed to update review: ${error.message}`);
    }
  }
}

export const realReviewService = new RealReviewService();
