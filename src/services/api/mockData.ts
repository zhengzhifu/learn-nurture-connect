
import { Profile, School, Availability, Specialty } from '@/types/auth';
import { Service } from '@/types/service';

// Mock profiles
export const mockProfiles: Profile[] = [
  {
    id: '1',
    full_name: 'John Smith',
    email: 'john@example.com',
    user_type: 'parent',
    phone: '555-123-4567',
    avatar_url: '/placeholder.svg',
    home_address: '123 Main St, Anytown, USA',
    verified: true,
    approval_status: 'approved',
    school_id: '1',
    child_school_id: '1'
  },
  {
    id: '2',
    full_name: 'Sarah Johnson',
    email: 'sarah@example.com',
    user_type: 'tutor',
    phone: '555-987-6543',
    avatar_url: '/placeholder.svg',
    home_address: '456 Oak Ave, Somewhere, USA',
    verified: true,
    approval_status: 'approved',
    school_id: '2'
  },
  {
    id: '3',
    full_name: 'Mike Davis',
    email: 'mike@example.com',
    user_type: 'parent',
    phone: '555-555-5555',
    avatar_url: '/placeholder.svg',
    home_address: '789 Pine St, Nowhere, USA',
    verified: false,
    approval_status: 'pending',
    school_id: '3',
    child_school_id: '2'
  },
  {
    id: '4',
    full_name: 'Emily Williams',
    email: 'emily@example.com',
    user_type: 'tutor',
    phone: '555-222-3333',
    avatar_url: '/placeholder.svg',
    home_address: '321 Elm St, Anywhere, USA',
    verified: true,
    approval_status: 'approved',
    school_id: '1'
  },
  {
    id: '5',
    full_name: 'Alex Johnson',
    email: 'alex@example.com',
    user_type: 'admin',
    phone: '555-444-9999',
    avatar_url: '/placeholder.svg',
    home_address: '654 Maple Ave, Elsewhere, USA',
    verified: true,
    approval_status: 'approved'
  }
];

// Mock schools
export const mockSchools: School[] = [
  {
    id: '1',
    name: 'Lincoln High School',
    address: '100 School St, Anytown, USA',
    status: 'approved',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Washington Elementary',
    address: '200 Education Blvd, Somewhere, USA',
    status: 'approved',
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Jefferson Middle School',
    address: '300 Learning Ave, Nowhere, USA',
    status: 'approved',
    created_at: '2023-01-03T00:00:00Z',
    updated_at: '2023-01-03T00:00:00Z'
  }
];

// Mock services
export const mockServices: Service[] = [
  {
    id: '1',
    title: 'Math Tutoring',
    description: 'Expert math tutoring for all levels',
    type: 'tutoring_paid',
    price: 35,
    rating: 4.8,
    location: 'Anytown, USA',
    image: '/placeholder.svg',
    availability: ['Monday', 'Wednesday', 'Friday'],
    provider_id: '2',
    subjects: ['Algebra', 'Calculus', 'Statistics']
  },
  {
    id: '2',
    title: 'Science Tutoring',
    description: 'Comprehensive science tutoring',
    type: 'tutoring_paid',
    price: 40,
    rating: 4.6,
    location: 'Somewhere, USA',
    image: '/placeholder.svg',
    availability: ['Tuesday', 'Thursday', 'Saturday'],
    provider_id: '4',
    subjects: ['Biology', 'Chemistry', 'Physics']
  },
  {
    id: '3',
    title: 'Homework Help',
    description: 'General homework assistance',
    type: 'tutoring_voluntary',
    price: 0,
    rating: 4.5,
    location: 'Anywhere, USA',
    image: '/placeholder.svg',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    provider_id: '2',
    subjects: ['General']
  },
  {
    id: '4',
    title: 'Babysitting Services',
    description: 'Reliable and experienced babysitting',
    type: 'babysitting',
    price: 25,
    rating: 4.9,
    location: 'Nowhere, USA',
    image: '/placeholder.svg',
    availability: ['Saturday', 'Sunday'],
    provider_id: '4'
  }
];

// Mock availability
export const mockAvailability: Availability[] = [
  {
    id: '1',
    user_id: '2',
    day_of_week: 'Monday',
    start_time: '15:00',
    end_time: '19:00',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: '2',
    day_of_week: 'Wednesday',
    start_time: '15:00',
    end_time: '19:00',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '3',
    user_id: '2',
    day_of_week: 'Friday',
    start_time: '15:00',
    end_time: '19:00',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '4',
    user_id: '4',
    day_of_week: 'Tuesday',
    start_time: '16:00',
    end_time: '20:00',
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z'
  },
  {
    id: '5',
    user_id: '4',
    day_of_week: 'Thursday',
    start_time: '16:00',
    end_time: '20:00',
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z'
  },
  {
    id: '6',
    user_id: '4',
    day_of_week: 'Saturday',
    start_time: '10:00',
    end_time: '17:00',
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z'
  }
];

// Mock specialties
export const mockSpecialties: Specialty[] = [
  {
    id: '1',
    user_id: '2',
    specialty_type: 'subject',
    specialty_name: 'Algebra',
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: '2',
    specialty_type: 'subject',
    specialty_name: 'Calculus',
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '3',
    user_id: '2',
    specialty_type: 'grade',
    specialty_name: 'High School',
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '4',
    user_id: '4',
    specialty_type: 'subject',
    specialty_name: 'Biology',
    created_at: '2023-01-02T00:00:00Z'
  },
  {
    id: '5',
    user_id: '4',
    specialty_type: 'subject',
    specialty_name: 'Chemistry',
    created_at: '2023-01-02T00:00:00Z'
  },
  {
    id: '6',
    user_id: '4',
    specialty_type: 'grade',
    specialty_name: 'Middle School',
    created_at: '2023-01-02T00:00:00Z'
  }
];
