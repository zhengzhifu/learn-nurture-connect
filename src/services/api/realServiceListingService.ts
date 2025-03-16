
import { supabase } from '@/integrations/supabase/client';
import { ServiceData, ServiceFilters } from './serviceClient';
import { ServiceType } from '@/types/service';

export class RealServiceListingService {
  async getServices(): Promise<ServiceData[]> {
    try {
      console.log('RealServiceListingService: getServices called');
      
      // Using tutor_services table as the source for our service data
      const { data, error } = await supabase
        .from('tutor_services')
        .select('*, profiles(full_name)');
        
      if (error) {
        console.error('Error fetching services from Supabase:', error);
        return [];
      }
      
      // Transform the data into ServiceData format
      const services: ServiceData[] = data.map(item => ({
        id: item.id,
        title: `${item.service_type.includes('tutoring') ? 'Tutoring' : 'Babysitting'} Service`,
        description: `${item.service_type} service in ${item.location_address || 'Various locations'}`,
        type: this.mapServiceType(item.service_type),
        price: item.hourly_rate ? Number(item.hourly_rate) : 0,
        rating: 4.5, // Default rating since we don't have this in tutor_services
        location: item.location_address || 'Various locations',
        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop', // Default image
        availability: item.availability ? this.parseAvailability(item.availability) : [],
        provider_id: item.tutor_id,
        subjects: item.tutoring_subjects || []
      }));
      
      console.log(`RealServiceListingService: getServices returning ${services.length} services`);
      return services;
    } catch (error) {
      console.error('Exception fetching services:', error);
      return [];
    }
  }
  
  async filterServices(filters: ServiceFilters): Promise<ServiceData[]> {
    try {
      console.log('RealServiceListingService: filterServices called with filters:', JSON.stringify(filters, null, 2));
      
      // Get all services first, then apply filters in memory
      // This is a workaround until we have a proper filtering mechanism
      const allServices = await this.getServices();
      
      let filteredServices = [...allServices];
      
      // Filter by service type
      if (filters.types && filters.types.length > 0) {
        filteredServices = filteredServices.filter(service => 
          filters.types?.includes(service.type)
        );
      }
      
      // Filter by location
      if (filters.location) {
        filteredServices = filteredServices.filter(service => 
          service.location.toLowerCase().includes(filters.location?.toLowerCase() || '')
        );
      }
      
      // Filter by price range
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        filteredServices = filteredServices.filter(service => 
          service.price >= min && service.price <= max
        );
      }
      
      // Filter by subjects
      if (filters.subjects && filters.subjects.length > 0) {
        filteredServices = filteredServices.filter(service => 
          service.subjects?.some(subject => 
            filters.subjects?.includes(subject)
          )
        );
      }
      
      // Filter by availability
      if (filters.availability && filters.availability.length > 0) {
        filteredServices = filteredServices.filter(service => 
          service.availability.some(slot => 
            filters.availability?.includes(slot)
          )
        );
      }
      
      console.log(`RealServiceListingService: filterServices returning filtered results`);
      return filteredServices;
    } catch (error) {
      console.error('Error filtering services:', error);
      return [];
    }
  }
  
  async searchServices(query: string): Promise<ServiceData[]> {
    try {
      console.log('RealServiceListingService: searchServices called with query:', query);
      
      if (!query.trim()) {
        console.log('RealServiceListingService: searchServices returning all services (empty query)');
        return this.getServices();
      }
      
      // Get all services and filter in memory
      const allServices = await this.getServices();
      
      // Search in title, description and location
      const lowerQuery = query.toLowerCase();
      return allServices.filter(service => 
        service.title.toLowerCase().includes(lowerQuery) ||
        (service.description && service.description.toLowerCase().includes(lowerQuery)) ||
        service.location.toLowerCase().includes(lowerQuery) ||
        service.subjects?.some(subject => subject.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Error searching services:', error);
      return [];
    }
  }
  
  private mapServiceType(type: string): ServiceType {
    if (type.includes('tutoring')) {
      return 'tutoring';
    } else if (type === 'babysitting') {
      return 'babysitting';
    } else {
      return 'tutoring'; // Default
    }
  }
  
  private parseAvailability(availabilityJson: any): string[] {
    try {
      if (Array.isArray(availabilityJson)) {
        return availabilityJson.map(item => item.toString());
      } else if (typeof availabilityJson === 'object') {
        // If it's a JSON object, extract values that might represent availability
        return Object.values(availabilityJson)
          .filter(Boolean)
          .map(item => item.toString());
      }
      return [];
    } catch (e) {
      console.error('Error parsing availability:', e);
      return [];
    }
  }
}

export const realServiceListingService = new RealServiceListingService();
