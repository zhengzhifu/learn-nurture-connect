
import { ServiceData, ServiceFilters } from '../serviceClient';
import { supabase } from '@/integrations/supabase/client';

export class EdgeFunctionServiceClient {
  async getServices(): Promise<ServiceData[]> {
    try {
      console.log('EdgeFunctionServiceClient: getServices called');
      
      const { data, error } = await supabase.functions.invoke('search-tutor-services', {
        body: {}
      });
      
      if (error) {
        console.error('Error fetching services from edge function:', error);
        throw error;
      }
      
      console.log(`EdgeFunctionServiceClient: getServices returning ${data?.length} services`);
      return data || [];
    } catch (error) {
      console.error('Exception fetching services:', error);
      throw error;
    }
  }
  
  async filterServices(filters: ServiceFilters): Promise<ServiceData[]> {
    try {
      console.log('EdgeFunctionServiceClient: filterServices called with:', filters);
      
      const { data, error } = await supabase.functions.invoke('search-tutor-services', {
        body: filters
      });
      
      if (error) {
        console.error('Error filtering services:', error);
        throw error;
      }
      
      console.log(`EdgeFunctionServiceClient: filterServices returning ${data?.length} results`);
      return data || [];
    } catch (error) {
      console.error('Error filtering services:', error);
      throw error;
    }
  }
  
  async searchServices(query: string): Promise<ServiceData[]> {
    try {
      console.log('EdgeFunctionServiceClient: searchServices called with query:', query);
      
      if (!query.trim()) {
        return this.getServices();
      }
      
      const { data, error } = await supabase.functions.invoke('search-tutor-services', {
        body: { query }
      });
      
      if (error) {
        console.error('Error searching services:', error);
        throw error;
      }
      
      console.log(`EdgeFunctionServiceClient: searchServices returning ${data?.length} results`);
      return data || [];
    } catch (error) {
      console.error('Error searching services:', error);
      throw error;
    }
  }
}

export const edgeFunctionServiceClient = new EdgeFunctionServiceClient();
