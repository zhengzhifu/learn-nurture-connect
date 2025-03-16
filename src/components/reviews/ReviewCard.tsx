
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Review } from '@/types/review';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const formattedDate = formatDistanceToNow(new Date(review.created_at), { addSuffix: true });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={review.tutor_avatar} alt={review.tutor_name} />
            <AvatarFallback>{getInitials(review.tutor_name)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3 className="font-medium">{review.tutor_name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${
                          i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </span>
                  <span className="ml-2">{formattedDate}</span>
                </div>
              </div>
              <Badge variant="outline">{review.subject}</Badge>
            </div>
            
            <p className="text-sm mt-2">{review.content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
