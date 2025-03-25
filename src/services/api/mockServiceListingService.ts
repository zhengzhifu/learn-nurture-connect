
import { ServiceType } from '@/types/service';
import { ServiceData, ServiceFilters } from '@/types/service';
import { mockServices } from './mockData';
import { toServiceType } from './implementations/serviceUtils';

export class MockServiceListingService {
  async getServices(): Promise<ServiceData[]> {
    console.log('MockServiceListingService: getServices called');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log(`MockServiceListingService: getServices returning ${mockServices.length} services`);
    return mockServices;
  }
  
  async filterServices(filters: ServiceFilters): Promise<ServiceData[]> {
    console.log('MockServiceListingService: filterServices called with filters:', JSON.stringify(filters, null, 2));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Apply filters
    let results = [...mockServices];
    
    // Filter by service type
    if (filters.types && filters.types.length > 0) {
      results = results.filter(service => filters.types?.includes(toServiceType(service.type)));
    }
    
    // Filter by location
    if (filters.location) {
      results = results.filter(service => 
        service.location.toLowerCase().includes(filters.location?.toLowerCase() || '')
      );
    }
    
    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      results = results.filter(service => service.price >= min && service.price <= max);
    }
    
    // Filter by subjects
    if (filters.subjects && filters.subjects.length > 0) {
      results = results.filter(service => 
        service.subjects?.some(subject => 
          filters.subjects?.includes(subject)
        )
      );
    }
    
    // Filter by availability
    if (filters.availability && filters.availability.length > 0) {
      results = results.filter(service => 
        service.availability.some(slot => 
          filters.availability?.includes(slot)
        )
      );
    }
    
    console.log(`MockServiceListingService: filterServices returning ${results.length} filtered services`);
    return results;
  }
  
  async searchServices(query: string): Promise<ServiceData[]> {
    console.log('MockServiceListingService: searchServices called with query:', query);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!query.trim()) {
      console.log(`MockServiceListingService: searchServices returning all ${mockServices.length} services (empty query)`);
      return mockServices;
    }
    
    // Search in title, description and location
    const lowerQuery = query.toLowerCase();
    const results = mockServices.filter(service => 
      service.title.toLowerCase().includes(lowerQuery) ||
      (service.description && service.description.toLowerCase().includes(lowerQuery)) ||
      service.location.toLowerCase().includes(lowerQuery) ||
      service.subjects?.some(subject => subject.toLowerCase().includes(lowerQuery))
    );
    
    console.log(`MockServiceListingService: searchServices returning ${results.length} matching services for query "${query}"`);
    return results;
  }
}

export const mockServiceListingService = new MockServiceListingService();
