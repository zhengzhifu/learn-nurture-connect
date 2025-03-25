
import { ServiceType, ServiceData } from '@/types/service';

export const safeProfileData = (profileData: any) => {
  return {
    id: profileData.id || '',
    first_name: profileData.first_name || '',
    last_name: profileData.last_name || '',
    email: profileData.email || '',
    user_type: profileData.user_type || 'tutor',
    phone: profileData.phone || '',
    avatar_url: profileData.avatar_url || '',
    home_address: profileData.home_address || '',
    approval_status: profileData.approval_status || 'pending',
    school_id: profileData.school_id || null
  };
};

export const convertToServiceData = (data: any): ServiceData => {
  // Ensure all required fields for ServiceData are present
  return {
    id: data.id || '',
    title: data.title || '',
    description: data.description || '',
    type: data.type as ServiceType || 'tutoring',
    price: typeof data.price === 'number' ? data.price : 0,
    rating: typeof data.rating === 'number' ? data.rating : 0,
    location: data.location || 'Online',
    image: data.image || '',
    availability: Array.isArray(data.availability) ? data.availability : [],
    provider_id: data.provider_id || '',
    subjects: Array.isArray(data.subjects) ? data.subjects : [],
    
    // Additional properties
    provider_name: data.provider || '',
    provider_avatar: data.providerAvatar || '',
    // Map any additional properties that exist in the raw data
    ...(data.priceUnit ? { priceUnit: data.priceUnit } : {}),
    ...(data.locations ? { locations: data.locations } : {}),
    ...(data.serviceType ? { serviceType: data.serviceType } : {}),
    ...(data.grade ? { grade: data.grade } : {}),
    ...(data.featured !== undefined ? { featured: data.featured } : {})
  };
};
