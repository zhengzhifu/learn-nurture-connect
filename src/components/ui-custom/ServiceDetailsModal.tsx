
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ServiceData } from '@/services/api/serviceClient';
import { Star, MapPin, Clock, Book, DollarSign, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Button from './Button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ServiceDetailsModalProps {
  service: ServiceData;
  isOpen: boolean;
  onClose: () => void;
}

const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  service,
  isOpen,
  onClose,
}) => {
  const { isAuthenticated } = useAuth();
  const [isBooking, setIsBooking] = useState(false);
  
  const handleBookService = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book this service', {
        action: {
          label: 'Sign In',
          onClick: () => window.location.href = '/signin',
        },
      });
      return;
    }
    
    setIsBooking(true);
    // Simulate booking process
    setTimeout(() => {
      toast.success('Service booked successfully!');
      setIsBooking(false);
      onClose();
    }, 1500);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{service.title}</DialogTitle>
          <DialogDescription>
            {service.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="mb-6 space-y-4">
            {/* Provider information */}
            {service.provider_name && (
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-muted-foreground" />
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={service.provider_avatar || ''} alt={service.provider_name} />
                    <AvatarFallback>
                      {service.provider_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{service.provider_name}</span>
                </div>
              </div>
            )}
            
            {/* Rating */}
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              <span>{service.rating.toFixed(1)} Rating</span>
            </div>
            
            {/* Location */}
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-muted-foreground" />
              <span>{service.location}</span>
            </div>
            
            {/* Availability */}
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
              <span>
                {service.availability && service.availability.length > 0 
                  ? service.availability.join(', ') 
                  : 'Flexible'}
              </span>
            </div>
            
            {/* Price */}
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-muted-foreground" />
              <span>${service.price}/hr</span>
            </div>
            
            {/* Subjects */}
            {service.subjects && service.subjects.length > 0 && (
              <div className="flex items-start">
                <Book className="w-5 h-5 mr-2 mt-0.5 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {service.subjects.map((subject, index) => (
                    <Badge key={index} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <img 
            src={service.image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop'} 
            alt={service.title} 
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleBookService} 
            className="w-full"
            disabled={isBooking}
          >
            {isBooking ? 'Booking...' : 'Book This Service'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailsModal;
