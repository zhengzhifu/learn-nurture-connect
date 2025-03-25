
import { ServiceData, ServiceFilters, ServiceType } from '@/types/service';
import { convertToServiceData } from './implementations/serviceUtils';

export class MockServiceListingService {
  private services: ServiceData[] = [];
  
  constructor() {
    // Initialize with some mock data
    this.services = this.generateMockServices();
  }
  
  async getServices(): Promise<ServiceData[]> {
    // Return all mock services
    return [...this.services];
  }
  
  async filterServices(filters: ServiceFilters): Promise<ServiceData[]> {
    // Apply filters to the mock data
    let filteredServices = [...this.services];
    
    // Filter by service type
    if (filters.types && filters.types.length > 0) {
      filteredServices = filteredServices.filter(service => 
        filters.types!.includes(service.type as ServiceType)
      );
    }
    
    // Filter by location
    if (filters.location) {
      filteredServices = filteredServices.filter(service => 
        service.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    // Filter by price range
    if (filters.priceRange && filters.priceRange.length === 2) {
      const [minPrice, maxPrice] = filters.priceRange;
      filteredServices = filteredServices.filter(service => 
        service.price >= minPrice && service.price <= maxPrice
      );
    }
    
    // Filter by subjects
    if (filters.subjects && filters.subjects.length > 0) {
      filteredServices = filteredServices.filter(service => 
        service.subjects?.some(subject => 
          filters.subjects!.includes(subject)
        )
      );
    }
    
    // Filter by availability
    if (filters.availability && filters.availability.length > 0) {
      filteredServices = filteredServices.filter(service => 
        service.availability?.some(slot => 
          filters.availability!.includes(slot)
        )
      );
    }
    
    return filteredServices;
  }
  
  async searchServices(query: string): Promise<ServiceData[]> {
    // Search by title, description, or provider name
    const normalizedQuery = query.toLowerCase();
    return this.services.filter(service => 
      service.title.toLowerCase().includes(normalizedQuery) ||
      (service.description && service.description.toLowerCase().includes(normalizedQuery)) ||
      (service.provider_name && service.provider_name.toLowerCase().includes(normalizedQuery))
    );
  }
  
  private generateMockServices(): ServiceData[] {
    return [
      {
        id: "1",
        title: "Mathematics Tutoring",
        description: "One-on-one tutoring for high school and college mathematics.",
        type: "tutoring",
        price: 35,
        rating: 4.8,
        location: "Online",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        availability: ["Weekday evenings", "Weekends"],
        provider_id: "tutor-1",
        subjects: ["Algebra", "Calculus", "Statistics"],
        provider_name: "John Smith",
        provider_avatar: "https://randomuser.me/api/portraits/men/1.jpg"
      },
      {
        id: "2",
        title: "Physics Tutoring",
        description: "Expert physics tutoring for high school and undergraduate students.",
        type: "tutoring",
        price: 40,
        rating: 4.9,
        location: "Boston University",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        availability: ["Weekdays", "Saturday mornings"],
        provider_id: "tutor-2",
        subjects: ["Mechanics", "Electricity", "Optics"],
        provider_name: "Emily Johnson",
        provider_avatar: "https://randomuser.me/api/portraits/women/2.jpg"
      },
      {
        id: "3",
        title: "Evening Babysitting",
        description: "Reliable evening babysitting services for children of all ages.",
        type: "babysitting",
        price: 25,
        rating: 4.7,
        location: "Cambridge Area",
        image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        availability: ["Evenings", "Weekends"],
        provider_id: "sitter-1",
        subjects: [],
        provider_name: "Sarah Williams",
        provider_avatar: "https://randomuser.me/api/portraits/women/3.jpg"
      },
      {
        id: "4",
        title: "Computer Science Tutoring",
        description: "Programming and computer science tutoring for students of all levels.",
        type: "tutoring",
        price: 45,
        rating: 5.0,
        location: "MIT Area",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        availability: ["Flexible schedule"],
        provider_id: "tutor-3",
        subjects: ["Programming", "Data Structures", "Algorithms"],
        provider_name: "David Chen",
        provider_avatar: "https://randomuser.me/api/portraits/men/4.jpg"
      },
      {
        id: "5",
        title: "English and Writing Help",
        description: "Assistance with English literature, essays, and writing skills.",
        type: "tutoring",
        price: 30,
        rating: 4.6,
        location: "Harvard Square",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        availability: ["Afternoons", "Early evenings"],
        provider_id: "tutor-4",
        subjects: ["Literature", "Essay Writing", "Grammar"],
        provider_name: "Sophia Martinez",
        provider_avatar: "https://randomuser.me/api/portraits/women/5.jpg"
      }
    ];
  }
}
