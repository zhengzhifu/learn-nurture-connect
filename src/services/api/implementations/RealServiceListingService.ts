
import { supabase } from '@/integrations/supabase/client';
import { ServiceData, ServiceFilters } from '@/types/service';
import { toast } from 'sonner';
import { mockTutors } from '@/services/api/mockTutorService';
import { convertToServiceData } from './serviceUtils';

export class RealServiceListingService {
  async getServices(): Promise<ServiceData[]> {
    try {
      console.log("Fetching all services via GET request");
      // Make a GET request when no parameters are needed
      const { data, error } = await supabase.functions.invoke('get-services', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (error) {
        console.error("Error from get-services function:", error);
        throw error;
      }
      
      console.log("Services received:", data?.services ? data.services.length : 0);
      
      // If no services are returned, use mock data in development environment
      if (!data?.services || data.services.length === 0) {
        console.log("No actual services found, using mock data");
        return this.getMockServices();
      }
      
      return data?.services || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
      // Fall back to mock data in case of errors
      return this.getMockServices();
    }
  }
  
  async filterServices(filters: ServiceFilters): Promise<ServiceData[]> {
    try {
      // Ensure filters is not undefined or empty
      if (!filters || Object.keys(filters).length === 0) {
        console.log("No filters provided, fetching all services");
        return this.getServices();
      }
      
      console.log("Filtering services with:", JSON.stringify(filters, null, 2));
      // Pass filters as body parameter with explicit Content-Type header
      const { data, error } = await supabase.functions.invoke('get-services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { filters }
      });
      
      if (error) {
        console.error("Error from get-services function:", error);
        throw error;
      }
      
      console.log("Filtered services received:", data?.services ? data.services.length : 0);
      
      // If no filtered services are returned, try to filter the mock data
      if (!data?.services || data.services.length === 0) {
        console.log("No filtered services found, using filtered mock data");
        return this.getFilteredMockServices(filters);
      }
      
      return data?.services || [];
    } catch (error) {
      console.error('Error filtering services:', error);
      toast.error('Failed to filter services');
      // Fall back to filtered mock data
      return this.getFilteredMockServices(filters);
    }
  }
  
  async searchServices(query: string): Promise<ServiceData[]> {
    try {
      // If query is empty, just get all services
      if (!query || query.trim() === '') {
        console.log("Empty search query, fetching all services");
        return this.getServices();
      }
      
      console.log("Searching services with query:", query);
      // Pass query as body parameter with explicit Content-Type header
      const { data, error } = await supabase.functions.invoke('get-services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { query }
      });
      
      if (error) {
        console.error("Error from get-services function:", error);
        throw error;
      }
      
      console.log("Search results received:", data?.services ? data.services.length : 0);
      
      // If no search results, search the mock data
      if (!data?.services || data.services.length === 0) {
        console.log("No search results found, searching mock data");
        return this.getSearchedMockServices(query);
      }
      
      return data?.services || [];
    } catch (error) {
      console.error('Error searching services:', error);
      toast.error('Failed to search services');
      // Fall back to searched mock data
      return this.getSearchedMockServices(query);
    }
  }
  
  // Helper method to convert mock tutors to services format
  private getMockServices(): ServiceData[] {
    console.log("Using mock tutor data for services");
    return mockTutors.map(tutor => ({
      id: tutor.id,
      title: `${tutor.full_name} - Tutoring Services`,
      description: tutor.bio,
      type: 'tutoring',
      price: tutor.hourlyRate || 35,
      rating: tutor.rating || 4.5,
      location: 'Online',
      image: tutor.avatar_url,
      provider_name: tutor.full_name,
      provider_avatar: tutor.avatar_url,
      availability: tutor.availability || ['Flexible schedule'],
      subjects: tutor.subjects || ['General'],
    }));
  }
  
  // Filter mock services based on filters
  private getFilteredMockServices(filters: ServiceFilters): ServiceData[] {
    let filteredServices = this.getMockServices();
    
    // Apply type filter
    if (filters.types && filters.types.length > 0) {
      filteredServices = filteredServices.filter(service => 
        filters.types!.includes(service.type)
      );
    }
    
    // Apply location filter
    if (filters.location) {
      filteredServices = filteredServices.filter(service => 
        service.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    // Apply price range filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      filteredServices = filteredServices.filter(service => 
        service.price >= filters.priceRange![0] && service.price <= filters.priceRange![1]
      );
    }
    
    return filteredServices;
  }
  
  // Search mock services based on query
  private getSearchedMockServices(query: string): ServiceData[] {
    const normalizedQuery = query.toLowerCase();
    return this.getMockServices().filter(service => 
      service.title.toLowerCase().includes(normalizedQuery) || 
      (service.description && service.description.toLowerCase().includes(normalizedQuery)) ||
      (service.provider_name && service.provider_name.toLowerCase().includes(normalizedQuery))
    );
  }
}

export const realServiceListingService = new RealServiceListingService();
