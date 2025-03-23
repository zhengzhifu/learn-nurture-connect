
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
        .select('*, profiles(full_name, avatar_url)');
        
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
        subjects: item.tutoring_subjects || [],
        provider_name: item.profiles?.full_name || 'Unknown Provider',
        provider_avatar: item.profiles?.avatar_url || undefined
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
      
      let query = supabase
        .from('tutor_services')
        .select('*, profiles(full_name, avatar_url)');
      
      // Filter by service type
      if (filters.types && filters.types.length > 0) {
        // Convert types array to SQL-friendly format
        const typeConditions = filters.types.map(type => `service_type.ilike.%${type}%`).join(',');
        query = query.or(typeConditions);
      }
      
      // Filter by location
      if (filters.location) {
        query = query.ilike('location_address', `%${filters.location}%`);
      }
      
      // Filter by price range
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        query = query.gte('hourly_rate', min).lte('hourly_rate', max);
      }
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        console.error('Error filtering services:', error);
        return [];
      }
      
      // Transform and further filter the results
      let services = data.map(item => ({
        id: item.id,
        title: `${item.service_type.includes('tutoring') ? 'Tutoring' : 'Babysitting'} Service`,
        description: `${item.service_type} service in ${item.location_address || 'Various locations'}`,
        type: this.mapServiceType(item.service_type),
        price: item.hourly_rate ? Number(item.hourly_rate) : 0,
        rating: 4.5, // Default rating
        location: item.location_address || 'Various locations',
        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop', // Default image
        availability: item.availability ? this.parseAvailability(item.availability) : [],
        provider_id: item.tutor_id,
        subjects: item.tutoring_subjects || [],
        provider_name: item.profiles?.full_name || 'Unknown Provider',
        provider_avatar: item.profiles?.avatar_url || undefined
      }));
      
      // Client-side filtering for subjects and availability
      // These are arrays, so they're harder to filter in the database query
      if (filters.subjects && filters.subjects.length > 0) {
        services = services.filter(service => 
          service.subjects?.some(subject => 
            filters.subjects?.includes(subject)
          )
        );
      }
      
      if (filters.availability && filters.availability.length > 0) {
        services = services.filter(service => 
          service.availability.some(slot => 
            filters.availability?.includes(slot)
          )
        );
      }
      
      console.log(`RealServiceListingService: filterServices returning ${services.length} filtered results`);
      return services;
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
      
      // Search across multiple fields including the provider's name
      const { data, error } = await supabase
        .from('tutor_services')
        .select('*, profiles(full_name, avatar_url)')
        .or(`service_type.ilike.%${query}%,location_address.ilike.%${query}%`)
        .contains('tutoring_subjects', [query]);
      
      if (error) {
        console.error('Error searching services:', error);
        return [];
      }
      
      const services: ServiceData[] = data.map(item => ({
        id: item.id,
        title: `${item.service_type.includes('tutoring') ? 'Tutoring' : 'Babysitting'} Service`,
        description: `${item.service_type} service in ${item.location_address || 'Various locations'}`,
        type: this.mapServiceType(item.service_type),
        price: item.hourly_rate ? Number(item.hourly_rate) : 0,
        rating: 4.5, // Default rating
        location: item.location_address || 'Various locations',
        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop', // Default image
        availability: item.availability ? this.parseAvailability(item.availability) : [],
        provider_id: item.tutor_id,
        subjects: item.tutoring_subjects || [],
        provider_name: item.profiles?.full_name || 'Unknown Provider',
        provider_avatar: item.profiles?.avatar_url || undefined
      }));
      
      console.log(`RealServiceListingService: searchServices returning ${services.length} results`);
      return services;
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
