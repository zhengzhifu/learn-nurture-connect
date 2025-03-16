
import { Profile } from '@/types/auth';
import { ServiceType, ServiceSubject } from '@/types/service';

// Define the ServiceData interface
export interface ServiceData {
  id: string;
  title: string;
  description?: string;
  type: ServiceType;
  price: number;
  rating: number;
  location: string;
  image?: string;
  availability: string[];
  provider_id?: string;
  subjects?: string[];
}

// Define the ServiceFilters interface
export interface ServiceFilters {
  types?: ServiceType[];
  location?: string;
  priceRange?: [number, number];
  subjects?: string[];
  availability?: string[];
}

// Service client interface that will be implemented by both mock and real clients
export interface ServiceClient {
  // Profile operations
  fetchUserProfile(userId: string): Promise<Profile | null>;
  updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null>;
  
  // Service operations
  getServices(): Promise<ServiceData[]>;
  filterServices(filters: ServiceFilters): Promise<ServiceData[]>;
  searchServices(query: string): Promise<ServiceData[]>;
  
  // Add other service methods here as needed
}
