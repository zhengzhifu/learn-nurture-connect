
import { supabase } from '@/integrations/supabase/client';
import { ServiceData, ServiceFilters } from '@/types/service';
import { getDisplayName } from '@/utils/profileUtils';
import { ServiceListingUtils } from './ServiceListingUtils';
import { convertToServiceData } from './serviceUtils';

export class RealServiceListingService {
  async getServices(): Promise<ServiceData[]> {
    try {
      // Fetch tutors with their associated profiles
      const { data, error } = await supabase
        .from('tutors')
        .select(`
          *,
          profiles:profiles(*)
        `)
        .limit(20);
      
      if (error) {
        console.error('Error fetching services:', error);
        return [];
      }
      
      // Transform the data into the expected format
      return data.map(item => {
        const profile = item.profiles || {};
        
        // Add null checks when accessing profile properties
        const displayName = getDisplayName({
          id: profile.id || '',
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: profile.email || '',
          user_type: 'tutor'
        });
        
        // Create a raw data object to pass to the conversion utility
        const rawData = {
          id: item.id,
          title: `${displayName} - Tutoring Services`,
          description: item.bio || 'Professional tutoring services',
          provider: displayName,
          providerAvatar: profile.avatar_url || '',
          providerRating: 4.5, // Default rating
          providerReviews: 0, // Default review count
          price: item.hourly_rate || 35,
          priceUnit: 'hour',
          locations: ['Online'], // Default location
          location: 'Online',
          availability: ['Weekdays', 'Weekends'], // Default availability
          serviceType: 'tutoring',
          type: 'tutoring',
          rating: 4.5,
          subjects: ['General'], // Default subjects
          grade: 'All Grades',
          featured: false
        };
        
        return convertToServiceData(rawData);
      });
    } catch (error) {
      console.error('Error in getServices:', error);
      return [];
    }
  }
  
  async filterServices(filters: ServiceFilters): Promise<ServiceData[]> {
    try {
      // Start with a base query
      let query = supabase
        .from('tutors')
        .select(`
          *,
          profiles:profiles(*)
        `);
      
      // Apply filters to the query builder
      query = ServiceListingUtils.applyFilters(query, filters);
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        console.error('Error filtering services:', error);
        return [];
      }
      
      // Transform the data into the expected format
      return data.map(item => {
        const profile = item.profiles || {};
        
        // Add null checks when accessing profile properties
        const displayName = getDisplayName({
          id: profile.id || '',
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: profile.email || '',
          user_type: 'tutor'
        });
        
        // Create a raw data object to pass to the conversion utility
        const rawData = {
          id: item.id,
          title: `${displayName} - Tutoring Services`,
          description: item.bio || 'Professional tutoring services',
          provider: displayName,
          providerAvatar: profile.avatar_url || '',
          providerRating: 4.5, // Default rating
          providerReviews: 0, // Default review count
          price: item.hourly_rate || 35,
          priceUnit: 'hour',
          locations: ['Online'], // Default location
          location: 'Online',
          availability: ['Weekdays', 'Weekends'], // Default availability
          serviceType: 'tutoring',
          type: 'tutoring',
          rating: 4.5,
          subjects: ['General'], // Default subjects
          grade: 'All Grades',
          featured: false
        };
        
        return convertToServiceData(rawData);
      });
    } catch (error) {
      console.error('Error in filterServices:', error);
      return [];
    }
  }
  
  async searchServices(query: string): Promise<ServiceData[]> {
    try {
      // Search across multiple tables using full text search
      const { data, error } = await supabase
        .from('tutors')
        .select(`
          *,
          profiles:profiles(*)
        `)
        .or(`
          bio.ilike.%${query}%
        `)
        .limit(20);
      
      if (error) {
        console.error('Error searching services:', error);
        return [];
      }
      
      // Transform the data into the expected format
      return data.map(item => {
        const profile = item.profiles || {};
        
        // Add null checks when accessing profile properties
        const displayName = getDisplayName({
          id: profile.id || '',
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: profile.email || '',
          user_type: 'tutor'
        });
        
        // Create a raw data object to pass to the conversion utility
        const rawData = {
          id: item.id,
          title: `${displayName} - Tutoring Services`,
          description: item.bio || 'Professional tutoring services',
          provider: displayName,
          providerAvatar: profile.avatar_url || '',
          providerRating: 4.5, // Default rating
          providerReviews: 0, // Default review count
          price: item.hourly_rate || 35,
          priceUnit: 'hour',
          locations: ['Online'], // Default location
          location: 'Online',
          availability: ['Weekdays', 'Weekends'], // Default availability
          serviceType: 'tutoring',
          type: 'tutoring',
          rating: 4.5,
          subjects: ['General'], // Default subjects
          grade: 'All Grades',
          featured: false
        };
        
        return convertToServiceData(rawData);
      });
    } catch (error) {
      console.error('Error in searchServices:', error);
      return [];
    }
  }
}

export const realServiceListingService = new RealServiceListingService();
