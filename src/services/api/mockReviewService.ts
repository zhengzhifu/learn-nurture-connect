
import { Review } from '@/types/review';

// Mock reviews data
const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    tutor_id: '1',
    user_id: 'user123',
    rating: 5,
    content: "Amazing math tutor! My son's grades improved significantly after just a few sessions. Highly recommended for anyone struggling with calculus.",
    created_at: new Date('2023-09-15').toISOString(),
    tutor_name: 'Emilie Dubois',
    tutor_avatar: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop',
    subject: 'Mathematics'
  },
  {
    id: '2',
    tutor_id: '2',
    user_id: 'user123',
    rating: 4,
    content: "Very knowledgeable about physics and made complex concepts easy to understand. The only reason I'm not giving 5 stars is because sometimes sessions ran a bit over time.",
    created_at: new Date('2023-10-22').toISOString(),
    tutor_name: 'Lucas Bernard',
    tutor_avatar: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop',
    subject: 'Physics'
  },
  {
    id: '3',
    tutor_id: '3',
    user_id: 'user123',
    rating: 5,
    content: "The best babysitter we've ever had! Kids love her and I feel completely at ease leaving them in her care. Very responsible and always punctual.",
    created_at: new Date('2023-11-05').toISOString(),
    tutor_name: 'Sophie Martin',
    tutor_avatar: 'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?w=800&auto=format&fit=crop',
    subject: 'Babysitting'
  },
  {
    id: '4',
    tutor_id: '4',
    user_id: 'user123',
    rating: 3,
    content: "Decent tutor for English Literature. Helped me improve my essay structure, but I wish we had focused more on critical analysis techniques.",
    created_at: new Date('2023-12-10').toISOString(),
    tutor_name: 'Antoine Lefebvre',
    tutor_avatar: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop',
    subject: 'English Literature'
  },
  {
    id: '5',
    tutor_id: '5',
    user_id: 'user123',
    rating: 5,
    content: "Couldn't ask for a better childcare provider. My daughter actually looks forward to the days when she comes over! Very creative with activities and games.",
    created_at: new Date('2024-01-18').toISOString(),
    tutor_name: 'Camille Rousseau',
    tutor_avatar: 'https://images.unsplash.com/photo-1596656226630-05c1ab390ab1?w=800&auto=format&fit=crop',
    subject: 'Childcare'
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
      created_at: new Date().toISOString()
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
    
    const updatedReview = {
      ...MOCK_REVIEWS[reviewIndex],
      ...updatedData
    };
    
    console.log('Review updated:', updatedReview);
    
    return updatedReview;
  }
}

export const mockReviewService = new MockReviewService();
