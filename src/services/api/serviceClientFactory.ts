import { ServiceClient, ServiceData, ServiceFilters } from './serviceClient';
import { mockServiceClient } from './mockServiceClient';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { toast } from 'sonner';

// Real implementation using Supabase
export class RealServiceClient implements ServiceClient {
  async fetchUserProfile(userId: string): Promise<Profile | null> {
    try {
      console.log('RealServiceClient: Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, user_type, avatar_url, verified, phone, school_name, school_address, home_address')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile from Supabase:', error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return null;
    }
  }
  
  async updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
    try {
      console.log('RealServiceClient: Updating profile for user:', userId, 'with data:', data);
      
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
      console.log('RealServiceClient: Fetching all services');
      
      const { data, error } = await supabase
        .from('services')
        .select('*');
        
      if (error) {
        console.error('Error fetching services from Supabase:', error);
        return [];
      }
      
      return data as ServiceData[];
    } catch (error) {
      console.error('Exception fetching services:', error);
      return [];
    }
  }
  
  async filterServices(filters: ServiceFilters): Promise<ServiceData[]> {
    try {
      console.log('RealServiceClient: Filtering services with:', filters);
      
      let query = supabase.from('services').select('*');
      
      if (filters.types && filters.types.length > 0) {
        query = query.in('type', filters.types);
      }
      
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        query = query.gte('price', min).lte('price', max);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error filtering services in Supabase:', error);
        return [];
      }
      
      return data as ServiceData[];
    } catch (error) {
      console.error('Error filtering services:', error);
      return [];
    }
  }
  
  async searchServices(query: string): Promise<ServiceData[]> {
    try {
      console.log('RealServiceClient: Searching for services with query:', query);
      
      if (!query.trim()) {
        return this.getServices();
      }
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`);
      
      if (error) {
        console.error('Error searching services in Supabase:', error);
        return [];
      }
      
      return data as ServiceData[];
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
  // Start with the mock client for service functionality since we don't have the backend tables yet
  private static instance: ServiceClient = mockServiceClient;
  
  // Get the current client instance
  static getClient(): ServiceClient {
    return this.instance;
  }
  
  // Set a different client implementation
  static setClient(client: ServiceClient): void {
    this.instance = client;
  }
}
