
// Service types
export type ServiceType = 'tutoring' | 'babysitting' | 'tutoring_paid' | 'tutoring_voluntary';

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

export interface ServiceSubject {
  id: string;
  name: string;
}

export interface ServiceAvailability {
  id: string;
  name: string;
}
