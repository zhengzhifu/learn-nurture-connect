
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ServiceData } from '@/services/api/serviceClient';
import { Star, MapPin, Clock, Book, DollarSign, User, Mail, Phone, School } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Button from './Button';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ServiceDetailsModalProps {
  service: ServiceData;
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  isApproved: boolean;
}

const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  service,
  isOpen,
  onClose,
  isAuthenticated,
  isApproved,
}) => {
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
          {!isAuthenticated && (
            <Alert className="mb-4">
              <AlertDescription>
                Sign in to see more details about this service.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mb-6 space-y-4">
            {/* Provider information - only if authenticated */}
            {isAuthenticated && service.provider_name && (
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
            
            {/* School information */}
            {service.school && (
              <div className="flex items-center">
                <School className="w-5 h-5 mr-2 text-muted-foreground" />
                <span>{service.school}</span>
              </div>
            )}
            
            {/* Contact information - only if approved */}
            {isAuthenticated && isApproved && service.contact_email && (
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-muted-foreground" />
                <span>{service.contact_email}</span>
              </div>
            )}
            
            {isAuthenticated && isApproved && service.contact_phone && (
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-muted-foreground" />
                <span>{service.contact_phone}</span>
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
            
            {/* Availability - only if authenticated */}
            {isAuthenticated && (
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
                <span>
                  {service.availability && service.availability.length > 0 
                    ? service.availability.join(', ') 
                    : 'Flexible'}
                </span>
              </div>
            )}
            
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
          
          {!isAuthenticated && (
            <Alert className="mb-4">
              <AlertDescription>
                Please sign in to contact this service provider.
              </AlertDescription>
            </Alert>
          )}
          
          {isAuthenticated && !isApproved && (
            <Alert className="mb-4">
              <AlertDescription>
                Your account needs to be approved to contact service providers.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleBookService} 
            className="w-full"
            disabled={isBooking || !isAuthenticated || !isApproved}
          >
            {isBooking ? 'Booking...' : 'Book This Service'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailsModal;
