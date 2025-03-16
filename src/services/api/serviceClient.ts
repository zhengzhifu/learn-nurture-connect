
import { ServiceType } from '@/types/service';

// Define the interface for service data
export interface ServiceData {
  id: number;
  image: string;
  title: string;
  type: ServiceType;
  rating: number;
  location: string;
  price: string;
  availability: string;
}

// Define the interface for the service client
export interface ServiceClient {
  getServices(): Promise<ServiceData[]>;
  searchServices(query: string): Promise<ServiceData[]>;
  filterServices(filters: ServiceFilters): Promise<ServiceData[]>;
}

// Define the filters interface
export interface ServiceFilters {
  types?: ServiceType[];
  subjects?: string[];
  availability?: string[];
  location?: string;
  priceRange?: [number, number];
}

// Create the base class that will be extended for real implementation later
export abstract class BaseServiceClient implements ServiceClient {
  abstract getServices(): Promise<ServiceData[]>;
  abstract searchServices(query: string): Promise<ServiceData[]>;
  abstract filterServices(filters: ServiceFilters): Promise<ServiceData[]>;
}
