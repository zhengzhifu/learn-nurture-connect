
import { supabase } from '@/integrations/supabase/client';
import { ServiceData } from '@/types/service';
import { convertToServiceData, safeProfileData } from './serviceUtils';

export class RealServiceFetcher {
  async getServiceById(serviceId: string): Promise<ServiceData | null> {
    try {
      const { data, error } = await supabase
        .from('tutors')
        .select(`
          *,
          profiles:profiles(*)
        `)
        .eq('id', serviceId)
        .single();
      
      if (error) {
        console.error('Error fetching service by ID:', error);
        return null;
      }
      
      // Extract profile data safely
      const profile = safeProfileData(data.profiles || {});
      
      // Create a raw data object to pass to the conversion utility
      const rawData = {
        id: data.id,
        title: `${profile.first_name} ${profile.last_name} - Tutoring Services`,
        description: data.bio || 'Professional tutoring services',
        provider: `${profile.first_name} ${profile.last_name}`,
        providerAvatar: profile.avatar_url || '',
        providerRating: 4.5, // Default rating
        providerReviews: 0, // Default review count
        price: data.hourly_rate || 35,
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
    } catch (error) {
      console.error('Error in getServiceById:', error);
      return null;
    }
  }
}

export const realServiceFetcher = new RealServiceFetcher();
