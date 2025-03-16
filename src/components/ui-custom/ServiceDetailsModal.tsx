
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ServiceData } from '@/services/api/serviceClient';
import { cn } from '@/lib/utils';
import { CalendarIcon, Clock, MapPin, Star, LogIn } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Format price as a string (e.g. "$25/hr")
  const priceFormatted = `$${service.price}/hr`;

  const handleBookSlot = () => {
    if (!isAuthenticated) {
      // Redirect to sign in page if not authenticated
      navigate('/signin', { state: { from: location.pathname } });
      return;
    }
    
    if (!selectedDate) {
      toast.error('Please select a date first');
      return;
    }

    const bookingDetails = {
      serviceId: service.id,
      serviceName: service.title,
      date: format(selectedDate, 'PPP'),
      price: service.price
    };

    console.log('Booking details:', bookingDetails);
    
    // Show confirmation modal instead of closing right away
    setShowConfirmation(true);
  };

  const handleConfirmClose = () => {
    setShowConfirmation(false);
    setSelectedDate(undefined);
    onClose();
  };

  // If the confirmation dialog is showing
  if (showConfirmation) {
    return (
      <Dialog open={true} onOpenChange={handleConfirmClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">Booking Request Sent</DialogTitle>
            <DialogDescription className="text-center">
              Your booking request for {service.title} on {selectedDate && format(selectedDate, 'PPP')} has been sent to the tutor.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 text-center space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium">What happens next?</p>
              <p className="text-sm text-muted-foreground mt-2">
                The tutor will review your request and confirm the booking.
                You'll receive a notification once they respond.
              </p>
            </div>
            <Button onClick={handleConfirmClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{service.title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Image */}
          <div className="rounded-lg overflow-hidden h-56">
            <img 
              src={service.image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop'} 
              alt={service.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-1" />
                <span className="font-medium">{service.rating}</span>
              </div>
              <span className="font-semibold text-lg">{priceFormatted}</span>
            </div>

            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{service.location}</span>
            </div>

            <div className="flex items-center text-muted-foreground">
              <Clock className="w-4 h-4 mr-2" />
              <span>
                {service.availability && service.availability.length > 0 
                  ? service.availability.join(', ') 
                  : 'Flexible'}
              </span>
            </div>

            {service.description && (
              <p className="text-muted-foreground mt-2">
                {service.description}
              </p>
            )}

            {service.subjects && service.subjects.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Subjects:</h4>
                <div className="flex flex-wrap gap-2">
                  {service.subjects.map(subject => (
                    <div key={subject} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                      {subject}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Section */}
          <div className="border-t pt-4 mt-2">
            <h3 className="font-medium mb-3">Book a Slot</h3>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {isAuthenticated ? (
                <>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal w-full sm:w-[240px]",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'PPP') : <span>Select a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setIsCalendarOpen(false);
                        }}
                        initialFocus
                        disabled={(date) => date < new Date()}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <Button 
                    className="w-full sm:flex-1" 
                    onClick={handleBookSlot}
                    disabled={!selectedDate}
                  >
                    Book Now
                  </Button>
                </>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={handleBookSlot}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in to Book
                </Button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDetailsModal;
