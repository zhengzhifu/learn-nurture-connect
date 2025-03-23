
import { supabase } from '@/integrations/supabase/client';
import { ServiceData } from '../serviceClient';
import { mapServiceType, parseAvailability } from './ServiceListingUtils';

/**
 * Responsible for fetching profile data for services
 */
export class RealServiceFetcher {
  /**
   * Fetches profile data for a tutor ID
   */
  async fetchProfileData(tutorId: string): Promise<{ providerName: string; providerAvatar?: string }> {
    let providerName = 'Unknown Provider';
    let providerAvatar = undefined;
    
    if (tutorId) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', tutorId)
        .maybeSingle();
        
      if (profileData) {
        providerName = profileData.full_name;
        providerAvatar = profileData.avatar_url;
      }
    }
    
    return { providerName, providerAvatar };
  }

  /**
   * Transforms raw database data into a ServiceData object
   */
  async transformServiceData(item: any): Promise<ServiceData> {
    // Fetch profile data for the service if tutor_id exists
    const { providerName, providerAvatar } = await this.fetchProfileData(item.tutor_id);
    
    return {
      id: item.id,
      title: `${item.service_type.includes('tutoring') ? 'Tutoring' : 'Babysitting'} Service`,
      description: `${item.service_type} service in ${item.location_address || 'Various locations'}`,
      type: mapServiceType(item.service_type),
      price: item.hourly_rate ? Number(item.hourly_rate) : 0,
      rating: 4.5, // Default rating
      location: item.location_address || 'Various locations',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop', // Default image
      availability: item.availability ? parseAvailability(item.availability) : [],
      provider_id: item.tutor_id,
      subjects: item.tutoring_subjects || [],
      provider_name: providerName,
      provider_avatar: providerAvatar
    };
  }
}

export const realServiceFetcher = new RealServiceFetcher();
