
export interface Review {
  id: string;
  tutor_id: string;
  user_id: string;
  rating: number;
  content: string;
  created_at: string;
  tutor_name: string;
  tutor_avatar?: string;
  subject: string;
}
