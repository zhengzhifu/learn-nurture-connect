
// Review type
export interface Review {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  subject: string;
  created_at: string;
  
  // Virtual properties for UI display
  reviewer_name?: string;
  reviewer_avatar?: string;
}
