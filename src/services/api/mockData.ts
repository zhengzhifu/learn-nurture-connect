
import { ServiceData } from './serviceClient';
import { Profile } from '@/types/auth';

// Mock services data
export const MOCK_SERVICES: ServiceData[] = [
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
    school_name: 'Mock School',
    school_address: '123 School St, City',
    home_address: '456 Home St, City'
  };
};
