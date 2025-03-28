
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';
import { Star, MapPin, Clock, User, School } from 'lucide-react';
import { ServiceData } from '@/services/api/serviceClient';
import ServiceDetailsModal from './ServiceDetailsModal';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/hooks/useAuth';

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
  const { isAuthenticated, profile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Format price as a string (e.g. "$25/hr")
  const priceFormatted = `$${service.price}/hr`;
  
  // Format the availability as a string
  const availabilityText = service.availability && service.availability.length > 0 
    ? service.availability.join(', ') 
    : 'Flexible';
    
  // Ensure location is displayed properly
  const displayLocation = service.location || 'Online';

  const isApproved = profile?.approval_status === 'approved';
  
  const handleViewDetails = () => {
    setIsModalOpen(true);
    if (onClick) onClick();
  };

  return (
    <>
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
            
            {/* Provider information - only show if authenticated */}
            {isAuthenticated && service.provider_name && (
              <div className="flex items-center text-sm mb-2">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={service.provider_avatar || ''} alt={service.provider_name} />
                  <AvatarFallback>
                    {service.provider_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{service.provider_name}</span>
              </div>
            )}
            
            {/* School information - show regardless of authentication */}
            {service.school && (
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <School className="w-4 h-4 mr-1" />
                <span>{service.school}</span>
              </div>
            )}
            
            <div className="flex items-center text-muted-foreground text-sm mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{displayLocation}</span>
            </div>
            
            {/* Only show availability if authenticated */}
            {isAuthenticated && (
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span>{availabilityText}</span>
              </div>
            )}
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
            <Button onClick={handleViewDetails} variant="primary" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </div>

      {/* Service Details Modal */}
      <ServiceDetailsModal 
        service={service}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isAuthenticated={isAuthenticated}
        isApproved={isApproved}
      />
    </>
  );
};

export default ServiceCard;
