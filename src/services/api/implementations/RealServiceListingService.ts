
import { supabase } from '@/integrations/supabase/client';
import { ServiceData, ServiceFilters } from '@/types/service';
import { toast } from 'sonner';

export class RealServiceListingService {
  async getServices(): Promise<ServiceData[]> {
    try {
      const { data } = await supabase.functions.invoke('get-services');
      return data?.services || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
      return [];
    }
  }
  
  async filterServices(filters: ServiceFilters): Promise<ServiceData[]> {
    try {
      const { data } = await supabase.functions.invoke('get-services', {
        query: {
          filters: JSON.stringify(filters)
        }
      });
      return data?.services || [];
    } catch (error) {
      console.error('Error filtering services:', error);
      toast.error('Failed to filter services');
      return [];
    }
  }
  
  async searchServices(query: string): Promise<ServiceData[]> {
    try {
      const { data } = await supabase.functions.invoke('get-services', {
        query: {
          query
        }
      });
      return data?.services || [];
    } catch (error) {
      console.error('Error searching services:', error);
      toast.error('Failed to search services');
      return [];
    }
  }
}

export const realServiceListingService = new RealServiceListingService();
