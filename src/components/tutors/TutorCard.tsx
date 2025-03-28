
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, GraduationCap } from 'lucide-react';
import Button from '@/components/ui-custom/Button';
import { Profile } from '@/types/auth';

interface Tutor extends Profile {
  rating?: number;
  specialties?: string[];
  school?: {
    name: string;
    id: string;
  };
}

interface TutorCardProps {
  tutor: Tutor;
  onSelect?: (tutorId: string) => void;
  showSelectButton?: boolean;
  selected?: boolean;
  onToggleBookmark: (tutorId: string) => Promise<void>;
  onViewDetails?: (tutorId: string) => void;
}

const TutorCard: React.FC<TutorCardProps> = ({ 
  tutor, 
  onSelect,
  showSelectButton = false,
  selected = false,
  onToggleBookmark,
  onViewDetails
}) => {
  // Extract just the first name
  const firstName = tutor.first_name || tutor.full_name?.split(' ')[0] || '';
  
  return (
    <Card className={`overflow-hidden transition-shadow hover:shadow-md ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={tutor.avatar_url || ''} alt={firstName} />
            <AvatarFallback>{firstName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{firstName}</CardTitle>
            
            <div className="flex items-center gap-1 mt-1">
              {tutor.rating && (
                <div className="flex items-center text-yellow-500">
                  <Star className="fill-yellow-500 mr-1 h-4 w-4" />
                  <span className="text-sm font-medium">{tutor.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        {tutor.school && (
          <div className="flex items-start gap-2 mb-2">
            <GraduationCap className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <span className="text-sm">{tutor.school.name}</span>
          </div>
        )}
        
        {tutor.home_address && (
          <div className="flex items-start gap-2 mb-2">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <span className="text-sm">{tutor.home_address}</span>
          </div>
        )}
        
        <div className="flex items-center flex-wrap gap-1 mt-3">
          {tutor.specialties && tutor.specialties.map((specialty, index) => (
            <Badge key={index} variant="secondary" className="mr-1 mb-1">
              {specialty}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex flex-col gap-2">
        {showSelectButton && (
          <Button
            className="w-full"
            variant={selected ? "secondary" : "default"}
            onClick={() => onSelect && onSelect(tutor.id)}
          >
            {selected ? "Selected" : "Select Tutor"}
          </Button>
        )}
        
        {onViewDetails && (
          <Button
            className="w-full"
            variant="outline"
            onClick={() => onViewDetails(tutor.id)}
          >
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TutorCard;
