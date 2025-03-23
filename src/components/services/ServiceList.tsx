
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ServiceCard from '@/components/ui-custom/ServiceCard';
import { ServiceData } from '@/services/api/serviceClient';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ServiceListProps {
  serviceList: ServiceData[];
  isLoading: boolean;
  onServiceClick: (serviceId: string) => void;
  hasError?: boolean;
}

const ServiceList: React.FC<ServiceListProps> = ({ 
  serviceList, 
  isLoading, 
  onServiceClick,
  hasError = false
}) => {
  if (hasError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          There was an error loading the services. This might be due to a database configuration issue. 
          Please try again later or contact support.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-40 w-full mb-2" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (serviceList.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No services found. Try adjusting your filters or search query.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {serviceList.map((service) => (
        <ServiceCard 
          key={service.id} 
          service={service} 
          onClick={() => onServiceClick(service.id)}
        />
      ))}
    </div>
  );
};

export default ServiceList;
