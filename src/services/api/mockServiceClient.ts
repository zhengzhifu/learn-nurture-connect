
import { BaseServiceClient, ServiceData, ServiceFilters } from './serviceClient';

export class MockServiceClient extends BaseServiceClient {
  // Mock data for services
  private mockServices: ServiceData[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Math Tutoring - All Levels',
      type: 'tutoring',
      rating: 4.9,
      location: 'Boston University',
      price: '$25-40/hr',
      availability: 'Weekdays & Weekends'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Evening Babysitting',
      type: 'babysitting',
      rating: 4.8,
      location: 'Northwestern Area',
      price: '$20/hr',
      availability: 'Evenings & Weekends'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Language Arts & Writing',
      type: 'tutoring',
      rating: 4.7,
      location: 'Berkeley Area',
      price: '$30/hr',
      availability: 'Flexible Schedule'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Chemistry & Physics Tutoring',
      type: 'tutoring',
      rating: 4.6,
      location: 'Stanford Area',
      price: '$35/hr',
      availability: 'Weekday Afternoons'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Daytime Childcare',
      type: 'babysitting',
      rating: 4.9,
      location: 'Downtown Area',
      price: '$22/hr',
      availability: 'Weekday Mornings'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Computer Science & Coding',
      type: 'tutoring',
      rating: 4.8,
      location: 'MIT Area',
      price: '$40/hr',
      availability: 'Evenings & Weekends'
    }
  ];

  // Simulate API delay
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all services
  async getServices(): Promise<ServiceData[]> {
    console.log('MockServiceClient: Fetching all services');
    await this.delay(300); // Simulate network delay
    return [...this.mockServices];
  }

  // Search services by query
  async searchServices(query: string): Promise<ServiceData[]> {
    console.log(`MockServiceClient: Searching services with query: ${query}`);
    await this.delay(300); // Simulate network delay
    
    if (!query) return [...this.mockServices];
    
    const lowercaseQuery = query.toLowerCase();
    return this.mockServices.filter(service => 
      service.title.toLowerCase().includes(lowercaseQuery) || 
      service.location.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Filter services based on criteria
  async filterServices(filters: ServiceFilters): Promise<ServiceData[]> {
    console.log('MockServiceClient: Filtering services with filters:', filters);
    await this.delay(500); // Simulate network delay
    
    let filteredServices = [...this.mockServices];
    
    // Filter by service type
    if (filters.types && filters.types.length > 0) {
      filteredServices = filteredServices.filter(service => 
        filters.types?.includes(service.type)
      );
    }
    
    // Filter by location
    if (filters.location) {
      const lowercaseLocation = filters.location.toLowerCase();
      filteredServices = filteredServices.filter(service => 
        service.location.toLowerCase().includes(lowercaseLocation)
      );
    }
    
    // Filter by price range
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      
      filteredServices = filteredServices.filter(service => {
        // Extract numeric value from price string (e.g. "$25-40/hr" -> [25, 40])
        const priceMatch = service.price.match(/\$(\d+)(?:-(\d+))?/);
        if (priceMatch) {
          const lowerPrice = parseInt(priceMatch[1]);
          const upperPrice = priceMatch[2] ? parseInt(priceMatch[2]) : lowerPrice;
          
          // Check if the price range overlaps with the filter range
          return lowerPrice <= maxPrice && upperPrice >= minPrice;
        }
        return true;
      });
    }
    
    // Filter by availability
    if (filters.availability && filters.availability.length > 0) {
      filteredServices = filteredServices.filter(service => 
        filters.availability?.some(avail => 
          service.availability.toLowerCase().includes(avail.toLowerCase())
        )
      );
    }
    
    return filteredServices;
  }
}

// Export a singleton instance
export const mockServiceClient = new MockServiceClient();
