import { Profile, School, UserRole } from '@/types/auth';
import { Review } from '@/types/review';
import { ServiceListing } from '@/types/service';

// Generate a random ID for mock data
export const generateMockId = () => Math.random().toString(36).substring(2, 11);

// Mock user profiles
export const mockProfiles: Profile[] = [
  {
    id: 'user1',
    full_name: 'John Doe',
    email: 'john@example.com',
    user_type: 'parent',
    phone: '555-123-4567',
    avatar_url: 'https://i.pravatar.cc/150?img=1',
    verified: true,
    home_address: '123 Main St, Anytown, CA 12345',
    approval_status: 'approved',
    child_school_id: 'school1'
  },
  {
    id: 'user2',
    full_name: 'Jane Smith',
    email: 'jane@example.com',
    user_type: 'tutor',
    phone: '555-987-6543',
    avatar_url: 'https://i.pravatar.cc/150?img=2',
    verified: true,
    home_address: '456 Oak Ave, Somewhere, CA 54321',
    approval_status: 'approved',
    school_id: 'school1'
  },
  {
    id: 'user3',
    full_name: 'Robert Johnson',
    email: 'robert@example.com',
    user_type: 'tutor',
    phone: '555-555-5555',
    avatar_url: 'https://i.pravatar.cc/150?img=3',
    verified: true,
    home_address: '789 Elm St, Nowhere, CA 67890',
    approval_status: 'pending',
    school_id: 'school2'
  },
  {
    id: 'user4',
    full_name: 'Emily Wang',
    email: 'emily@example.com',
    user_type: 'admin',
    phone: '555-444-3333',
    avatar_url: 'https://i.pravatar.cc/150?img=4',
    verified: true,
    home_address: '321 Pine St, Everywhere, CA 13579',
    approval_status: 'approved'
  },
  {
    id: 'user5',
    full_name: 'Michael Brown',
    email: 'michael@example.com',
    user_type: 'parent',
    phone: '555-222-1111',
    avatar_url: 'https://i.pravatar.cc/150?img=5',
    verified: false,
    home_address: '654 Maple Dr, Elsewhere, CA 24680',
    approval_status: 'rejected',
    child_school_id: 'school3'
  }
];

// Mock schools
export const mockSchools: School[] = [
  {
    id: 'school1',
    name: 'Springfield Elementary',
    address: '123 School Lane, Springfield, CA 12345',
    status: 'approved',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'school2',
    name: 'Riverdale High',
    address: '456 Education Blvd, Riverdale, CA 54321',
    status: 'approved',
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z'
  },
  {
    id: 'school3',
    name: 'Westview Middle School',
    address: '789 Learning Ave, Westview, CA 67890',
    status: 'approved',
    created_at: '2023-01-03T00:00:00Z',
    updated_at: '2023-01-03T00:00:00Z'
  },
  {
    id: 'school4',
    name: 'Eastside Academy',
    address: '321 Scholar St, Eastside, CA 13579',
    status: 'pending',
    created_at: '2023-01-04T00:00:00Z',
    updated_at: '2023-01-04T00:00:00Z'
  }
];

// Mock services data
export const MOCK_SERVICES: ServiceListing[] = [
  {
    id: '1',
    title: 'Math Tutoring',
    description: 'Expert math tutoring for all levels',
    type: 'tutoring',
    price: 25,
    rating: 4.8,
    location: 'Montmartre, Paris',
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
    location: 'Le Marais, Paris',
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
    location: 'Saint-Germain-des-Prés, Paris',
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
    location: 'Latin Quarter, Paris',
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
    location: 'Bastille, Paris',
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
    location: 'Champs-Élysées, Paris',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop',
    availability: ['Weekends'],
    subjects: ['Computer Science', 'Programming']
  }
];

// Mock profile generation function
export const generateMockProfile = (userId: string): Profile => {
  return {
    id: userId,
    full_name: 'Mock User',
    email: 'mock@example.com',
    user_type: 'parent',
    phone: '123-456-7890',
    avatar_url: undefined,
    verified: true,
    school_name: 'École Internationale de Paris',
    school_address: '123 Rue de l\'École, Paris',
    home_address: '456 Avenue des Parisiens, Paris'
  };
};
