
import { ServiceClient, ServiceData, ServiceFilters } from './serviceClient';
import { mockServiceClient } from './mockServiceClient';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { ServiceType } from '@/types/service';
import { toast } from 'sonner';

// Real implementation using Supabase
export class RealServiceClient implements ServiceClient {
  async fetchUserProfile(userId: string): Promise<Profile | null> {
    try {
      console.log('RealServiceClient: fetchUserProfile called with userId:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, user_type, avatar_url, verified, phone, school_name, school_address, home_address')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile from Supabase:', error);
        return null;
      }

      console.log('RealServiceClient: fetchUserProfile returning:', data);
      return data as Profile;
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return null;
    }
  }
  
  async updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
    try {
      console.log('RealServiceClient: updateUserProfile called with userId:', userId, 'and data:', data);
      
      const { data: updatedData, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId)
        .select('id, full_name, email, user_type, avatar_url, verified, phone, school_name, school_address, home_address')
        .maybeSingle();
      
      if (error) {
        console.error('Error updating profile in Supabase:', error);
        throw error;
      }
      
      console.log('RealServiceClient: updateUserProfile returning:', updatedData);
      toast.success('Profile updated successfully');
      return updatedData as Profile;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
      throw error;
    }
  }

  async getServices(): Promise<ServiceData[]> {
    try {
      console.log('RealServiceClient: getServices called');
      
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
      
      console.log(`RealServiceClient: getServices returning ${services.length} services`);
      return services;
    } catch (error) {
      console.error('Exception fetching services:', error);
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
  
  async filterServices(filters: ServiceFilters): Promise<ServiceData[]> {
    try {
      console.log('RealServiceClient: filterServices called with filters:', JSON.stringify(filters, null, 2));
      
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
      
      console.log(`RealServiceClient: filterServices returning filtered results`);
      return filteredServices;
    } catch (error) {
      console.error('Error filtering services:', error);
      return [];
    }
  }
  
  async searchServices(query: string): Promise<ServiceData[]> {
    try {
      console.log('RealServiceClient: searchServices called with query:', query);
      
      if (!query.trim()) {
        console.log('RealServiceClient: searchServices returning all services (empty query)');
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
}

// Create an instance of the real client
export const realServiceClient = new RealServiceClient();

// This factory will help us switch between mock and real implementations
export class ServiceClientFactory {
  // Start with the real client for profile functionality since we have the Supabase backend setup
  private static instance: ServiceClient = realServiceClient;
  
  // Get the current client instance
  static getClient(): ServiceClient {
    console.log('ServiceClientFactory: getClient called, returning:', 
      this.instance === mockServiceClient ? 'mockServiceClient' : 'realServiceClient');
    return this.instance;
  }
  
  // Set a different client implementation
  static setClient(client: ServiceClient): void {
    console.log('ServiceClientFactory: setClient called, switching to:', 
      client === mockServiceClient ? 'mockServiceClient' : 'realServiceClient');
    this.instance = client;
  }
}
