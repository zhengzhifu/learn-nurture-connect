
import React from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { Star, MapPin, Clock } from 'lucide-react';

interface ServiceCardProps {
  image: string;
  title: string;
  type: 'tutoring' | 'babysitting';
  rating: number;
  location: string;
  price: string;
  availability: string;
  className?: string;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  image,
  title,
  type,
  rating,
  location,
  price,
  availability,
  className = '',
  onClick,
}) => {
  return (
    <div 
      className={cn(
        "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover-lift",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            type === 'tutoring' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
          )}>
            {type === 'tutoring' ? 'Tutoring' : 'Babysitting'}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-lg">{title}</h3>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm">{rating}</span>
            </div>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span>{availability}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-5 pt-4 border-t">
          <p className="font-medium">
            {price}
          </p>
          <Button onClick={onClick} variant="primary" size="sm">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
