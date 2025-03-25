
import { supabase } from '@/integrations/supabase/client';
import { ServiceData, ServiceFilters } from '@/types/service';
import { toast } from 'sonner';

export class RealServiceListingService {
  async getServices(): Promise<ServiceData[]> {
    try {
      // Make a GET request when no parameters are needed
      const { data, error } = await supabase.functions.invoke('get-services', {
        method: 'GET'
      });
      
      if (error) throw error;
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
        return this.getServices();
      }
      
      // Pass filters as body parameter 
      const { data, error } = await supabase.functions.invoke('get-services', {
        method: 'POST',
        body: { filters }
      });
      
      if (error) throw error;
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
        return this.getServices();
      }
      
      // Pass query as body parameter
      const { data, error } = await supabase.functions.invoke('get-services', {
        method: 'POST',
        body: { query }
      });
      
      if (error) throw error;
      return data?.services || [];
    } catch (error) {
      console.error('Error searching services:', error);
      toast.error('Failed to search services');
      return [];
    }
  }
}

export const realServiceListingService = new RealServiceListingService();
