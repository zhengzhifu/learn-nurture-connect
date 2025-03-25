
import { ServiceType, ServiceData } from '@/types/service';

/**
 * Safely gets a property from a potentially null or undefined object
 */
function safeGet(obj: any, prop: string, defaultValue: any = ''): any {
  if (!obj) return defaultValue;
  return obj[prop] !== undefined ? obj[prop] : defaultValue;
}

/**
 * Converts raw service data from the database to the ServiceData interface
 */
export function convertToServiceData(rawData: any): ServiceData {
  return {
    id: rawData.id || '',
    title: rawData.title || '',
    description: rawData.description || '',
    type: toServiceType(rawData.serviceType || 'tutoring'),
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

/**
 * Safely extracts profile data from potentially null objects
 */
export function safeProfileData(profileData: any): any {
  if (!profileData) return {};
  
  return {
    id: safeGet(profileData, 'id'),
    first_name: safeGet(profileData, 'first_name'),
    last_name: safeGet(profileData, 'last_name'),
    email: safeGet(profileData, 'email'),
    user_type: safeGet(profileData, 'user_type'),
    phone: safeGet(profileData, 'phone'),
    avatar_url: safeGet(profileData, 'avatar_url')
  };
}
