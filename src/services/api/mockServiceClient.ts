
import { ServiceClient, ServiceData, ServiceFilters } from './serviceClient';
import { Profile, UserRole } from '@/types/auth';
import { toast } from 'sonner';

// Mock services data
const MOCK_SERVICES: ServiceData[] = [
  {
    id: '1',
    title: 'Math Tutoring',
    description: 'Expert math tutoring for all levels',
    type: 'tutoring',
    price: 25,
    rating: 4.8,
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop',
    availability: ['Weekdays', 'Evenings'],
    subjects: ['Mathematics', 'Algebra', 'Calculus']
  },
  {
    id: '2',
    title: 'Science Tutoring',
    description: 'Physics and Chemistry expert',
    type: 'tutoring',
    price: 30,
    rating: 4.7,
    location: 'Boston, MA',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop',
    availability: ['Weekends', 'Afternoons'],
    subjects: ['Physics', 'Chemistry']
  },
  {
    id: '3',
    title: 'Experienced Babysitter',
    description: 'Caring and responsible babysitter',
    type: 'babysitting',
    price: 20,
    rating: 4.9,
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?w=800&auto=format&fit=crop',
    availability: ['Weekends', 'Evenings']
  },
  {
    id: '4',
    title: 'English Literature Tutor',
    description: 'Specialized in essay writing and literature analysis',
    type: 'tutoring',
    price: 35,
    rating: 4.6,
    location: 'Chicago, IL',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop',
    availability: ['Weekdays', 'Mornings'],
    subjects: ['English', 'Literature', 'Writing']
  },
  {
    id: '5',
    title: 'Certified Childcare Provider',
    description: 'Professional with 5+ years experience',
    type: 'babysitting',
    price: 22,
    rating: 4.9,
    location: 'Seattle, WA',
    image: 'https://images.unsplash.com/photo-1596656226630-05c1ab390ab1?w=800&auto=format&fit=crop',
    availability: ['Weekdays', 'Weekends', 'Evenings']
  },
  {
    id: '6',
    title: 'Computer Science Tutor',
    description: 'Programming and algorithms specialist',
    type: 'tutoring',
    price: 40,
    rating: 4.8,
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop',
    availability: ['Weekends'],
    subjects: ['Computer Science', 'Programming']
  }
];

// Mock implementation for development and testing
class MockServiceClient implements ServiceClient {
  async fetchUserProfile(userId: string): Promise<Profile | null> {
    console.log('MockServiceClient: fetchUserProfile called with userId:', userId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock profile data - Ensure user_type is of type UserRole
    const result: Profile = {
      id: userId,
      full_name: 'Mock User',
      email: 'mock@example.com',
      user_type: 'parent', // This is now correctly typed as UserRole
      phone: '123-456-7890',
      avatar_url: undefined,
      verified: true,
      school_name: 'Mock School',
      school_address: '123 School St, City',
      home_address: '456 Home St, City'
    };
    
    console.log('MockServiceClient: fetchUserProfile returning:', result);
    return result;
  }
  
  async updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
    console.log('MockServiceClient: updateUserProfile called with userId:', userId, 'and data:', data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create updated profile by merging input data
    // Ensure user_type is of type UserRole
    const updatedProfile: Profile = {
      id: userId,
      full_name: data.full_name || 'Mock User',
      email: 'mock@example.com', // Email can't be changed
      user_type: 'parent', // Ensuring this is a valid UserRole
      phone: data.phone || '123-456-7890',
      avatar_url: data.avatar_url,
      verified: true,
      school_name: data.school_name || 'Mock School',
      school_address: data.school_address || '123 School St, City',
      home_address: data.home_address || '456 Home St, City'
    };
    
    console.log('MockServiceClient: updateUserProfile returning:', updatedProfile);
    toast.success('Profile updated successfully (Mock)');
    return updatedProfile;
  }

  async getServices(): Promise<ServiceData[]> {
    console.log('MockServiceClient: getServices called');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log(`MockServiceClient: getServices returning ${MOCK_SERVICES.length} services`);
    return MOCK_SERVICES;
  }
  
  async filterServices(filters: ServiceFilters): Promise<ServiceData[]> {
    console.log('MockServiceClient: filterServices called with filters:', JSON.stringify(filters, null, 2));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Apply filters
    let results = [...MOCK_SERVICES];
    
    // Filter by service type
    if (filters.types && filters.types.length > 0) {
      results = results.filter(service => filters.types?.includes(service.type));
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
    
    console.log(`MockServiceClient: filterServices returning ${results.length} filtered services`);
    return results;
  }
  
  async searchServices(query: string): Promise<ServiceData[]> {
    console.log('MockServiceClient: searchServices called with query:', query);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!query.trim()) {
      console.log(`MockServiceClient: searchServices returning all ${MOCK_SERVICES.length} services (empty query)`);
      return MOCK_SERVICES;
    }
    
    // Search in title, description and location
    const lowerQuery = query.toLowerCase();
    const results = MOCK_SERVICES.filter(service => 
      service.title.toLowerCase().includes(lowerQuery) ||
      (service.description && service.description.toLowerCase().includes(lowerQuery)) ||
      service.location.toLowerCase().includes(lowerQuery) ||
      service.subjects?.some(subject => subject.toLowerCase().includes(lowerQuery))
    );
    
    console.log(`MockServiceClient: searchServices returning ${results.length} matching services for query "${query}"`);
    return results;
  }
}

// Create a singleton instance
export const mockServiceClient = new MockServiceClient();
