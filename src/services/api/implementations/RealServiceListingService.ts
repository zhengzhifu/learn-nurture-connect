
import { supabase } from '@/integrations/supabase/client';
import { ServiceData, ServiceFilters } from '@/types/service';
import { toast } from 'sonner';

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
      console.log("Raw response data:", JSON.stringify(data));
      
      return data?.services || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
      return [];
    }
  }
  
  async filterServices(filters: ServiceFilters): Promise<ServiceData[]> {
    try {
      // Ensure filters is not undefined or empty
      if (!filters || Object.keys(filters).length === 0) {
        console.log("No filters provided, fetching all services");
        return this.getServices();
      }
      
      console.log("Filtering services with:", filters);
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
      return data?.services || [];
    } catch (error) {
      console.error('Error filtering services:', error);
      toast.error('Failed to filter services');
      return [];
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
      return data?.services || [];
    } catch (error) {
      console.error('Error searching services:', error);
      toast.error('Failed to search services');
      return [];
    }
  }
}

export const realServiceListingService = new RealServiceListingService();
