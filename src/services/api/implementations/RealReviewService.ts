
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types/review';
import { safeProfileData } from './serviceUtils';

export class RealReviewService {
  async getUserReviews(userId: string): Promise<Review[]> {
    try {
      // Fetch reviews for a tutor
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviewer_id(*)
        `)
        .eq('reviewee_id', userId);
        
      if (error) {
        console.error('Error fetching user reviews:', error);
        return [];
      }
      
      // Map the data to the Review interface
      return data.map(review => {
        const reviewerProfile = safeProfileData(review.reviewer || {});
        
        // Get reviewer name
        const reviewerName = `${reviewerProfile.first_name || ''} ${reviewerProfile.last_name || ''}`.trim() || 'Anonymous';
        
        return {
          id: review.id,
          reviewer_id: review.reviewer_id,
          reviewee_id: review.reviewee_id,
          rating: review.rating,
          comment: review.comment || '',
          created_at: review.created_at,
          subject: review.subject || 'General',
          reviewer_name: reviewerName,
          reviewer_avatar: reviewerProfile.avatar_url || '',
          
          // Map to legacy fields for backward compatibility
          tutor_id: review.reviewee_id,
          user_id: review.reviewer_id,
          content: review.comment || '',
          tutor_name: 'Tutor',
          tutor_avatar: ''
        } as Review;
      });
    } catch (error) {
      console.error('Error in getUserReviews:', error);
      return [];
    }
  }
  
  async addReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          reviewer_id: review.reviewer_id || review.user_id,
          reviewee_id: review.reviewee_id || review.tutor_id,
          rating: review.rating,
          comment: review.comment || review.content,
          subject: review.subject
        })
        .select('*')
        .single();
        
      if (error) {
        console.error('Error adding review:', error);
        throw new Error(`Failed to add review: ${error.message}`);
      }
      
      // Get reviewer profile
      const { data: reviewerData, error: reviewerError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', review.reviewer_id || review.user_id)
        .single();
        
      if (reviewerError) {
        console.error('Error fetching reviewer profile:', reviewerError);
      }
      
      const reviewerProfile = safeProfileData(reviewerData || {});
      
      // Get reviewer name
      const reviewerName = `${reviewerProfile.first_name || ''} ${reviewerProfile.last_name || ''}`.trim() || 'Anonymous';
      
      return {
        id: data.id,
        reviewer_id: data.reviewer_id,
        reviewee_id: data.reviewee_id,
        rating: data.rating,
        comment: data.comment,
        created_at: data.created_at,
        subject: data.subject,
        reviewer_name: reviewerName,
        reviewer_avatar: reviewerProfile.avatar_url || '',
        
        // Map to legacy fields for backward compatibility
        tutor_id: data.reviewee_id,
        user_id: data.reviewer_id,
        content: data.comment,
        tutor_name: 'Tutor',
        tutor_avatar: ''
      } as Review;
    } catch (error) {
      console.error('Error in addReview:', error);
      throw error;
    }
  }
  
  async updateReview(reviewId: string, updatedData: Partial<Review>): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          rating: updatedData.rating,
          comment: updatedData.comment || updatedData.content,
          subject: updatedData.subject
        })
        .eq('id', reviewId)
        .select('*')
        .single();
        
      if (error) {
        console.error('Error updating review:', error);
        throw new Error(`Failed to update review: ${error.message}`);
      }
      
      // Get reviewer profile
      const { data: reviewerData, error: reviewerError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.reviewer_id)
        .single();
        
      if (reviewerError) {
        console.error('Error fetching reviewer profile:', reviewerError);
      }
      
      const reviewerProfile = safeProfileData(reviewerData || {});
      
      // Get reviewer name
      const reviewerName = `${reviewerProfile.first_name || ''} ${reviewerProfile.last_name || ''}`.trim() || 'Anonymous';
      
      return {
        id: data.id,
        reviewer_id: data.reviewer_id,
        reviewee_id: data.reviewee_id,
        rating: data.rating,
        comment: data.comment,
        created_at: data.created_at,
        subject: data.subject,
        reviewer_name: reviewerName,
        reviewer_avatar: reviewerProfile.avatar_url || '',
        
        // Map to legacy fields for backward compatibility
        tutor_id: data.reviewee_id,
        user_id: data.reviewer_id,
        content: data.comment,
        tutor_name: 'Tutor',
        tutor_avatar: ''
      } as Review;
    } catch (error) {
      console.error('Error in updateReview:', error);
      throw error;
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
    } catch (error) {
      console.error('Error in deleteReview:', error);
      throw error;
    }
  }
}

export const realReviewService = new RealReviewService();
