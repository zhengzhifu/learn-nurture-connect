
import { supabase } from '@/integrations/supabase/client';
import { ServiceData, ServiceFilters } from '../serviceClient';
import { getDisplayName } from '@/utils/profileUtils';
import { ServiceListingUtils } from './ServiceListingUtils';

export class RealServiceListingService {
  async getServices(): Promise<ServiceData[]> {
    try {
      // Fetch tutors with their associated profiles
      const { data, error } = await supabase
        .from('tutors')
        .select(`
          *,
          profiles:id(*)
        `)
        .limit(20);
      
      if (error) {
        console.error('Error fetching services:', error);
        return [];
      }
      
      // Transform the data into the expected format
      return data.map(item => {
        const tutorProfile = item.profiles || {};
        const tutorName = getDisplayName({
          id: tutorProfile.id || '',
          first_name: tutorProfile.first_name || '',
          last_name: tutorProfile.last_name || '',
          email: tutorProfile.email || '',
          user_type: 'tutor'
        });
        
        return {
          id: item.id,
          title: `${tutorName} - Tutoring Services`,
          description: item.bio || 'Professional tutoring services',
          provider: tutorName,
          providerAvatar: tutorProfile.avatar_url || '',
          providerRating: 4.5, // Default rating
          providerReviews: 0, // Default review count
          price: item.hourly_rate || 35,
          priceUnit: 'hour',
          locations: ['Online'], // Default location
          availability: ['Weekdays', 'Weekends'], // Default availability
          serviceType: 'tutoring',
          subjects: ['General'], // Default subjects
          grade: 'All Grades',
          featured: false
        };
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
          profiles:id(*)
        `);
      
      // Apply filters to the query builder
      query = ServiceListingUtils.applyTutorFilters(query, filters);
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        console.error('Error filtering services:', error);
        return [];
      }
      
      // Transform the data into the expected format
      return data.map(item => {
        const tutorProfile = item.profiles || {};
        const tutorName = getDisplayName({
          id: tutorProfile.id || '',
          first_name: tutorProfile.first_name || '',
          last_name: tutorProfile.last_name || '',
          email: tutorProfile.email || '',
          user_type: 'tutor'
        });
        
        return {
          id: item.id,
          title: `${tutorName} - Tutoring Services`,
          description: item.bio || 'Professional tutoring services',
          provider: tutorName,
          providerAvatar: tutorProfile.avatar_url || '',
          providerRating: 4.5, // Default rating
          providerReviews: 0, // Default review count
          price: item.hourly_rate || 35,
          priceUnit: 'hour',
          locations: ['Online'], // Default location
          availability: ['Weekdays', 'Weekends'], // Default availability
          serviceType: 'tutoring',
          subjects: ['General'], // Default subjects
          grade: 'All Grades',
          featured: false
        };
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
          profiles:id(*)
        `)
        .or(`
          profiles.first_name.ilike.%${query}%,
          profiles.last_name.ilike.%${query}%,
          bio.ilike.%${query}%
        `)
        .limit(20);
      
      if (error) {
        console.error('Error searching services:', error);
        return [];
      }
      
      // Transform the data into the expected format
      return data.map(item => {
        const tutorProfile = item.profiles || {};
        const tutorName = getDisplayName({
          id: tutorProfile.id || '',
          first_name: tutorProfile.first_name || '',
          last_name: tutorProfile.last_name || '',
          email: tutorProfile.email || '',
          user_type: 'tutor'
        });
        
        return {
          id: item.id,
          title: `${tutorName} - Tutoring Services`,
          description: item.bio || 'Professional tutoring services',
          provider: tutorName,
          providerAvatar: tutorProfile.avatar_url || '',
          providerRating: 4.5, // Default rating
          providerReviews: 0, // Default review count
          price: item.hourly_rate || 35,
          priceUnit: 'hour',
          locations: ['Online'], // Default location
          availability: ['Weekdays', 'Weekends'], // Default availability
          serviceType: 'tutoring',
          subjects: ['General'], // Default subjects
          grade: 'All Grades',
          featured: false
        };
      });
    } catch (error) {
      console.error('Error in searchServices:', error);
      return [];
    }
  }
}

export const realServiceListingService = new RealServiceListingService();
