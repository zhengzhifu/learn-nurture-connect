
import { Review } from '@/types/review';

// Mock reviews data
const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    reviewer_id: 'user123',
    reviewee_id: 'tutor1',
    rating: 5,
    comment: "Amazing math tutor! My son's grades improved significantly after just a few sessions. Highly recommended for anyone struggling with calculus.",
    subject: 'Mathematics',
    created_at: new Date('2023-09-15').toISOString(),
    reviewer_name: 'Emilie Dubois',
    reviewer_avatar: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop',
    // Legacy fields
    tutor_id: 'tutor1',
    user_id: 'user123',
    content: "Amazing math tutor! My son's grades improved significantly after just a few sessions. Highly recommended for anyone struggling with calculus.",
    tutor_name: 'Emilie Dubois',
    tutor_avatar: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    reviewer_id: 'user123',
    reviewee_id: 'tutor2',
    rating: 4,
    comment: "Very knowledgeable about physics and made complex concepts easy to understand. The only reason I'm not giving 5 stars is because sometimes sessions ran a bit over time.",
    subject: 'Physics',
    created_at: new Date('2023-10-22').toISOString(),
    reviewer_name: 'Lucas Bernard',
    reviewer_avatar: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop',
    // Legacy fields
    tutor_id: 'tutor2',
    user_id: 'user123',
    content: "Very knowledgeable about physics and made complex concepts easy to understand. The only reason I'm not giving 5 stars is because sometimes sessions ran a bit over time.",
    tutor_name: 'Lucas Bernard',
    tutor_avatar: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    reviewer_id: 'user123',
    reviewee_id: 'tutor3',
    rating: 5,
    comment: "The best babysitter we've ever had! Kids love her and I feel completely at ease leaving them in her care. Very responsible and always punctual.",
    subject: 'Babysitting',
    created_at: new Date('2023-11-05').toISOString(),
    reviewer_name: 'Sophie Martin',
    reviewer_avatar: 'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?w=800&auto=format&fit=crop',
    // Legacy fields
    tutor_id: 'tutor3',
    user_id: 'user123',
    content: "The best babysitter we've ever had! Kids love her and I feel completely at ease leaving them in her care. Very responsible and always punctual.",
    tutor_name: 'Sophie Martin',
    tutor_avatar: 'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    reviewer_id: 'user123',
    reviewee_id: 'tutor4',
    rating: 3,
    comment: "Decent tutor for English Literature. Helped me improve my essay structure, but I wish we had focused more on critical analysis techniques.",
    subject: 'English Literature',
    created_at: new Date('2023-12-10').toISOString(),
    reviewer_name: 'Antoine Lefebvre',
    reviewer_avatar: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop',
    // Legacy fields
    tutor_id: 'tutor4',
    user_id: 'user123',
    content: "Decent tutor for English Literature. Helped me improve my essay structure, but I wish we had focused more on critical analysis techniques.",
    tutor_name: 'Antoine Lefebvre',
    tutor_avatar: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop'
  },
  {
    id: '5',
    reviewer_id: 'user123',
    reviewee_id: 'tutor5',
    rating: 5,
    comment: "Couldn't ask for a better childcare provider. My daughter actually looks forward to the days when she comes over! Very creative with activities and games.",
    subject: 'Childcare',
    created_at: new Date('2024-01-18').toISOString(),
    reviewer_name: 'Camille Rousseau',
    reviewer_avatar: 'https://images.unsplash.com/photo-1596656226630-05c1ab390ab1?w=800&auto=format&fit=crop',
    // Legacy fields
    tutor_id: 'tutor5',
    user_id: 'user123',
    content: "Couldn't ask for a better childcare provider. My daughter actually looks forward to the days when she comes over! Very creative with activities and games.",
    tutor_name: 'Camille Rousseau',
    tutor_avatar: 'https://images.unsplash.com/photo-1596656226630-05c1ab390ab1?w=800&auto=format&fit=crop'
  }
];

export class MockReviewService {
  async getUserReviews(userId: string): Promise<Review[]> {
    // In a real app, we would filter by the actual userId
    // For demo purposes, we'll return all reviews
    console.log(`Fetching reviews for user ${userId}`);
    return MOCK_REVIEWS;
  }

  async addReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    console.log('Adding new review:', review);
    const newReview: Review = {
      ...review,
      id: `${MOCK_REVIEWS.length + 1}`,
      created_at: new Date().toISOString(),
      // Set legacy fields for backward compatibility
      content: review.comment,
      tutor_name: review.reviewer_name || 'Anonymous',
      tutor_avatar: review.reviewer_avatar || '',
      tutor_id: review.reviewee_id,
      user_id: review.reviewer_id
    };
    
    // In a real app, we would add this to the database
    // For demo purposes, we'll just log it
    console.log('New review created:', newReview);
    
    return newReview;
  }

  async deleteReview(reviewId: string): Promise<void> {
    console.log(`Deleting review ${reviewId}`);
    // In a real app, we would remove from the database
    // For demo purposes, we'll just log it
  }

  async updateReview(reviewId: string, updatedData: Partial<Review>): Promise<Review> {
    console.log(`Updating review ${reviewId} with:`, updatedData);
    
    // Find the review to update
    const reviewIndex = MOCK_REVIEWS.findIndex(r => r.id === reviewId);
    if (reviewIndex === -1) {
      throw new Error(`Review with ID ${reviewId} not found`);
    }
    
    // In a real app, we would update in the database
    // For demo purposes, we'll just log it
    
    const updatedReview: Review = {
      ...MOCK_REVIEWS[reviewIndex],
      ...updatedData,
      // Update legacy fields for backward compatibility
      content: updatedData.comment || MOCK_REVIEWS[reviewIndex].content,
      tutor_name: updatedData.reviewer_name || MOCK_REVIEWS[reviewIndex].tutor_name,
      tutor_avatar: updatedData.reviewer_avatar || MOCK_REVIEWS[reviewIndex].tutor_avatar
    };
    
    console.log('Review updated:', updatedReview);
    
    return updatedReview;
  }
}

export const mockReviewService = new MockReviewService();
