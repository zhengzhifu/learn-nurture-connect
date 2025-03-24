
import { ServiceData, ServiceFilters } from '../serviceClient';
import { BaseService } from '../base/BaseService';
import { realServiceFetcher } from './RealServiceFetcher';

export class RealServiceListingService extends BaseService {
  async getServices(): Promise<ServiceData[]> {
    try {
      console.log('RealServiceListingService: getServices called');
      
      // Using a separate query for profiles to avoid RLS recursion issues
      const { data, error } = await this.supabase
        .from('tutor_services')
        .select('*');
        
      if (error) {
        console.error('Error fetching services from Supabase:', error);
        throw error; // Throw the error to be caught by the calling function
      }

      console.log('Raw tutor_services data:', data);
      
      if (!data || data.length === 0) {
        console.log('No tutor services found in the database');
        return [];
      }

      // Transform and fetch profile data separately to handle the services
      const services: ServiceData[] = await Promise.all(
        data.map(item => realServiceFetcher.transformServiceData(item))
      );
      
      console.log(`RealServiceListingService: getServices returning ${services.length} services:`, services);
      return services;
    } catch (error) {
      console.error('Exception fetching services:', error);
      return [];
    }
  }
  
  async filterServices(filters: ServiceFilters): Promise<ServiceData[]> {
    try {
      console.log('RealServiceListingService: filterServices called with filters:', JSON.stringify(filters, null, 2));
      
      let query = this.supabase
        .from('tutor_services')
        .select('*');
      
      // Apply database-level filters
      query = this.applyDatabaseFilters(query, filters);
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        console.error('Error filtering services:', error);
        throw error; // Throw the error to be caught by the calling function
      }
      
      if (!data || data.length === 0) {
        console.log('No services found matching the filters');
        return [];
      }
      
      // Transform data to ServiceData objects
      let services = await Promise.all(
        data.map(item => realServiceFetcher.transformServiceData(item))
      );
      
      // Apply client-side filters
      services = this.applyClientSideFilters(services, filters);
      
      console.log(`RealServiceListingService: filterServices returning ${services.length} filtered results:`, services);
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
      
      // Search across multiple fields
      const { data, error } = await this.supabase
        .from('tutor_services')
        .select('*')
        .or(`service_type.ilike.%${query}%,location_address.ilike.%${query}%`);
      
      if (error) {
        console.error('Error searching services:', error);
        throw error; // Throw the error to be caught by the calling function
      }
      
      if (!data || data.length === 0) {
        console.log('No services found matching the search query');
        return [];
      }
      
      // Transform data to ServiceData objects
      const services: ServiceData[] = await Promise.all(
        data.map(item => realServiceFetcher.transformServiceData(item))
      );
      
      console.log(`RealServiceListingService: searchServices returning ${services.length} results:`, services);
      return services;
    } catch (error) {
      console.error('Error searching services:', error);
      return [];
    }
  }
  
  private applyDatabaseFilters(query: any, filters: ServiceFilters): any {
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
    
    return query;
  }
  
  private applyClientSideFilters(services: ServiceData[], filters: ServiceFilters): ServiceData[] {
    let filteredServices = services;
    
    // Client-side filtering for subjects and availability
    // These are arrays, so they're harder to filter in the database query
    if (filters.subjects && filters.subjects.length > 0) {
      filteredServices = filteredServices.filter(service => 
        service.subjects?.some(subject => 
          filters.subjects?.includes(subject)
        )
      );
    }
    
    if (filters.availability && filters.availability.length > 0) {
      filteredServices = filteredServices.filter(service => 
        service.availability.some(slot => 
          filters.availability?.includes(slot)
        )
      );
    }
    
    return filteredServices;
  }
}

export const realServiceListingService = new RealServiceListingService();
