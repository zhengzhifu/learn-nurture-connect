
import React from 'react';
import { Tutor } from '@/services/api/mockTutorService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui-custom/Button';
import { Star, BookmarkPlus, BookmarkCheck, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TutorCardProps {
  tutor: Tutor;
  onToggleBookmark: (tutorId: string) => void;
  onViewDetails: (tutorId: string) => void;
}

const TutorCard: React.FC<TutorCardProps> = ({ 
  tutor, 
  onToggleBookmark, 
  onViewDetails 
}) => {
  return (
    <Card className="hover-lift overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Tutor Image and Basic Info */}
          <div className="md:w-1/3 relative h-full max-h-48 md:max-h-none">
            <div className="w-full h-40 md:h-full">
              <img 
                src={tutor.avatar_url || 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400'} 
                alt={`${tutor.full_name}`} 
                className="w-full h-full object-cover"
              />
            </div>
            {tutor.verified && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-green-500">Verified</Badge>
              </div>
            )}
          </div>
          
          {/* Tutor Details */}
          <div className="p-5 md:w-2/3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{tutor.full_name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span>{tutor.rating} ({tutor.reviewCount} reviews)</span>
                </div>
              </div>
              <span className="font-medium">${tutor.hourlyRate}/hr</span>
            </div>
            
            <div className="mb-3 text-sm">
              <p className="text-muted-foreground flex items-center gap-1 mb-1">
                <MapPin className="h-3.5 w-3.5" />
                {tutor.school_name || "Online"}
              </p>
              <p className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {tutor.availability.join(', ')}
              </p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm line-clamp-2">{tutor.bio}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Subjects:</p>
              <div className="flex flex-wrap gap-1">
                {tutor.subjects.map((subject, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <Button
                onClick={() => onToggleBookmark(tutor.id)}
                variant="outline"
                size="sm"
                icon={tutor.isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
              >
                {tutor.isBookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button
                onClick={() => onViewDetails(tutor.id)}
                variant="default"
                size="sm"
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorCard;
