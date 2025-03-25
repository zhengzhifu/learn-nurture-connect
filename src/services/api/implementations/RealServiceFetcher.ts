
import { supabase } from '@/integrations/supabase/client';
import { BaseService } from '../base/BaseService';
import { ServiceData } from '../serviceClient';
import { getDisplayName } from '@/utils/profileUtils';

export class RealServiceFetcher extends BaseService {
  async fetchServiceById(serviceId: string): Promise<ServiceData | null> {
    try {
      console.log(`Fetching service details for ID: ${serviceId}`);
      
      const { data, error } = await this.supabase
        .from('tutors')
        .select(`
          *,
          profiles:id(*)
        `)
        .eq('id', serviceId)
        .single();
        
      if (error) {
        console.error('Error fetching service details:', error);
        return null;
      }
      
      if (!data) {
        console.log('No service found with ID:', serviceId);
        return null;
      }
      
      // Extract tutor profile data and create display name from first_name and last_name
      const tutorProfile = data.profiles || {};
      const tutorName = getDisplayName({
        id: tutorProfile.id || '',
        first_name: tutorProfile.first_name || '',
        last_name: tutorProfile.last_name || '',
        email: tutorProfile.email || '',
        user_type: 'tutor'
      });
      
      // Transform the data into the expected ServiceData format
      const serviceData: ServiceData = {
        id: data.id,
        title: `${tutorName} - Tutoring Services`,
        description: data.bio || 'Professional tutoring services',
        provider: tutorName,
        providerAvatar: tutorProfile.avatar_url || '',
        providerRating: 4.5, // Default rating
        providerReviews: 0, // Default review count
        price: data.hourly_rate || 35,
        priceUnit: 'hour',
        locations: ['Online'], // Default location
        availability: ['Weekdays', 'Weekends'], // Default availability
        serviceType: 'tutoring',
        subjects: ['General'], // Default subjects
        grade: 'All Grades',
        featured: false
      };
      
      console.log('Service data fetched successfully:', serviceData);
      return serviceData;
    } catch (error) {
      console.error('Exception in fetchServiceById:', error);
      return null;
    }
  }
}

export const realServiceFetcher = new RealServiceFetcher();
