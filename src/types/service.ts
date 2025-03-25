
// Service types
export type ServiceType = 'tutoring' | 'babysitting' | 'tutoring_paid' | 'tutoring_voluntary' | 'childcare';

export interface Service {
  id: string;
  title: string;
  description?: string;
  type: ServiceType;
  price: number;
  rating: number; // Changed from optional to required to match ServiceData
  location: string;
  image?: string;
  availability: string[];
  provider_id: string;
  subjects?: string[];
}

export interface ServiceData {
  id: string;
  title: string;
  description?: string;
  type: ServiceType;
  price: number;
  rating: number;
  location: string;
  image?: string;
  availability?: string[];
  provider_id?: string;
  subjects?: string[];
  provider_name?: string;
  provider_avatar?: string;
  
  // Additional properties
  provider?: string;
  providerAvatar?: string;
  providerRating?: number;
  providerReviews?: number;
  priceUnit?: string;
  locations?: string[];
  serviceType?: string;
  grade?: string;
  featured?: boolean;
}

export interface ServiceSubject {
  id: string;
  name: string;
}

export interface ServiceAvailability {
  id: string;
  name: string;
}
