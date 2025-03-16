
import React from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { Star, MapPin, Clock } from 'lucide-react';
import { ServiceData } from '@/services/api/serviceClient';

interface ServiceCardProps {
  service: ServiceData;
  className?: string;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  className = '',
  onClick,
}) => {
  // Format price as a string (e.g. "$25/hr")
  const priceFormatted = `$${service.price}/hr`;
  
  // Format the availability as a string
  const availabilityText = service.availability && service.availability.length > 0 
    ? service.availability.join(', ') 
    : 'Flexible';

  return (
    <div 
      className={cn(
        "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={service.image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop'} 
          alt={service.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            service.type === 'tutoring' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
          )}>
            {service.type === 'tutoring' ? 'Tutoring' : 'Babysitting'}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-lg">{service.title}</h3>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm">{service.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{service.location}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span>{availabilityText}</span>
          </div>
        </div>
        
        {service.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {service.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-5 pt-4 border-t">
          <p className="font-medium">
            {priceFormatted}
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
