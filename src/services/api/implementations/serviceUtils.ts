
import { ServiceType } from '@/types/service';
import { ServiceData } from '@/types/service';

/**
 * Converts raw service data from the database to the ServiceData interface
 */
export function convertToServiceData(rawData: any): ServiceData {
  return {
    id: rawData.id || '',
    title: rawData.title || '',
    description: rawData.description || '',
    type: (rawData.serviceType || 'tutoring') as ServiceType,
    price: parseFloat(rawData.price || '0'),
    rating: parseFloat(rawData.rating || '0'),
    location: rawData.location || '',
    image: rawData.image || '',
    availability: rawData.availability || [],
    provider_id: rawData.provider_id || '',
    subjects: rawData.subjects || [],
    provider_name: rawData.provider || '',
    provider_avatar: rawData.providerAvatar || '',
    
    // Additional properties
    provider: rawData.provider || '',
    providerAvatar: rawData.providerAvatar || '',
    providerRating: parseFloat(rawData.providerRating || '0'),
    providerReviews: parseInt(rawData.providerReviews || '0'),
    priceUnit: rawData.priceUnit || 'hour',
    locations: rawData.locations || [rawData.location || ''],
    serviceType: rawData.serviceType || 'tutoring',
    grade: rawData.grade || '',
    featured: !!rawData.featured
  };
}

/**
 * Safely ensures the provided value is a valid ServiceType
 */
export function toServiceType(type: string): ServiceType {
  switch (type.toLowerCase()) {
    case 'tutoring':
      return 'tutoring';
    case 'childcare':
      return 'childcare';
    case 'babysitting':
      return 'babysitting';
    case 'tutoring_paid':
      return 'tutoring_paid';
    case 'tutoring_voluntary':
      return 'tutoring_voluntary';
    default:
      return 'tutoring';
  }
}
