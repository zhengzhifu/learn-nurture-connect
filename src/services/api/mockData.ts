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
  },
  {
    id: '6',
    full_name: 'Sophie Martin',
    email: 'sophie@example.com',
    user_type: 'tutor',
    phone: '33-6-12-34-56-78',
    avatar_url: '/placeholder.svg',
    home_address: '15 Rue de Rivoli, 75001 Paris, France',
    verified: true,
    approval_status: 'approved',
    school_id: '1'
  },
  {
    id: '7',
    full_name: 'Antoine Dubois',
    email: 'antoine@example.com',
    user_type: 'tutor',
    phone: '33-6-23-45-67-89',
    avatar_url: '/placeholder.svg',
    home_address: '24 Avenue des Champs-Élysées, 75008 Paris, France',
    verified: true,
    approval_status: 'approved',
    school_id: '2'
  },
  {
    id: '8',
    full_name: 'Camille Leroy',
    email: 'camille@example.com',
    user_type: 'tutor',
    phone: '33-6-34-56-78-90',
    avatar_url: '/placeholder.svg',
    home_address: '7 Rue Mouffetard, 75005 Paris, France',
    verified: true,
    approval_status: 'approved',
    school_id: '3'
  },
  {
    id: '9',
    full_name: 'Lucas Bernard',
    email: 'lucas@example.com',
    user_type: 'tutor',
    phone: '33-6-45-67-89-01',
    avatar_url: '/placeholder.svg',
    home_address: '42 Rue de la Pompe, 75016 Paris, France',
    verified: true,
    approval_status: 'approved',
    school_id: '1'
  },
  {
    id: '10',
    full_name: 'Émilie Petit',
    email: 'emilie@example.com',
    user_type: 'tutor',
    phone: '33-6-56-78-90-12',
    avatar_url: '/placeholder.svg',
    home_address: '8 Boulevard Saint-Michel, 75006 Paris, France',
    verified: true,
    approval_status: 'approved',
    school_id: '2'
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
  },
  {
    id: '5',
    title: 'French Language Tutoring',
    description: 'Native French speaker offering language lessons for all levels',
    type: 'tutoring_paid',
    price: 40,
    rating: 4.9,
    location: 'Paris, France',
    image: '/placeholder.svg',
    availability: ['Monday', 'Wednesday', 'Friday'],
    provider_id: '6',
    subjects: ['French Grammar', 'Conversation', 'Literature']
  },
  {
    id: '6',
    title: 'Mathematics & Physics',
    description: 'Engineering graduate offering advanced math and physics tutoring',
    type: 'tutoring_paid',
    price: 45,
    rating: 4.8,
    location: 'Paris, France',
    image: '/placeholder.svg',
    availability: ['Tuesday', 'Thursday', 'Saturday'],
    provider_id: '7',
    subjects: ['Calculus', 'Mechanics', 'Thermodynamics']
  },
  {
    id: '7',
    title: 'History & Geography Lessons',
    description: 'Make history and geography come alive with engaging tutoring sessions',
    type: 'tutoring_paid',
    price: 35,
    rating: 4.7,
    location: 'Paris, France',
    image: '/placeholder.svg',
    availability: ['Monday', 'Wednesday', 'Friday'],
    provider_id: '8',
    subjects: ['World History', 'European History', 'Human Geography']
  },
  {
    id: '8',
    title: 'Computer Science Tutoring',
    description: 'Learn programming and computer science concepts from an industry professional',
    type: 'tutoring_paid',
    price: 50,
    rating: 4.9,
    location: 'Paris, France',
    image: '/placeholder.svg',
    availability: ['Tuesday', 'Thursday', 'Saturday'],
    provider_id: '9',
    subjects: ['Python', 'Java', 'Web Development']
  },
  {
    id: '9',
    title: 'English Language Practice',
    description: 'Improve your English with a fluent speaker focusing on conversation and pronunciation',
    type: 'tutoring_voluntary',
    price: 0,
    rating: 4.6,
    location: 'Paris, France',
    image: '/placeholder.svg',
    availability: ['Wednesday', 'Friday', 'Sunday'],
    provider_id: '10',
    subjects: ['English Conversation', 'Pronunciation', 'Grammar']
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
  },
  {
    id: '7',
    user_id: '6',
    day_of_week: 'Monday',
    start_time: '14:00',
    end_time: '18:00',
    created_at: '2023-01-03T00:00:00Z',
    updated_at: '2023-01-03T00:00:00Z'
  },
  {
    id: '8',
    user_id: '6',
    day_of_week: 'Wednesday',
    start_time: '14:00',
    end_time: '18:00',
    created_at: '2023-01-03T00:00:00Z',
    updated_at: '2023-01-03T00:00:00Z'
  },
  {
    id: '9',
    user_id: '6',
    day_of_week: 'Friday',
    start_time: '14:00',
    end_time: '18:00',
    created_at: '2023-01-03T00:00:00Z',
    updated_at: '2023-01-03T00:00:00Z'
  },
  {
    id: '10',
    user_id: '7',
    day_of_week: 'Tuesday',
    start_time: '15:00',
    end_time: '19:00',
    created_at: '2023-01-04T00:00:00Z',
    updated_at: '2023-01-04T00:00:00Z'
  },
  {
    id: '11',
    user_id: '7',
    day_of_week: 'Thursday',
    start_time: '15:00',
    end_time: '19:00',
    created_at: '2023-01-04T00:00:00Z',
    updated_at: '2023-01-04T00:00:00Z'
  },
  {
    id: '12',
    user_id: '7',
    day_of_week: 'Saturday',
    start_time: '10:00',
    end_time: '15:00',
    created_at: '2023-01-04T00:00:00Z',
    updated_at: '2023-01-04T00:00:00Z'
  },
  {
    id: '13',
    user_id: '8',
    day_of_week: 'Monday',
    start_time: '16:00',
    end_time: '20:00',
    created_at: '2023-01-05T00:00:00Z',
    updated_at: '2023-01-05T00:00:00Z'
  },
  {
    id: '14',
    user_id: '8',
    day_of_week: 'Wednesday',
    start_time: '16:00',
    end_time: '20:00',
    created_at: '2023-01-05T00:00:00Z',
    updated_at: '2023-01-05T00:00:00Z'
  },
  {
    id: '15',
    user_id: '8',
    day_of_week: 'Friday',
    start_time: '16:00',
    end_time: '20:00',
    created_at: '2023-01-05T00:00:00Z',
    updated_at: '2023-01-05T00:00:00Z'
  },
  {
    id: '16',
    user_id: '9',
    day_of_week: 'Tuesday',
    start_time: '17:00',
    end_time: '21:00',
    created_at: '2023-01-06T00:00:00Z',
    updated_at: '2023-01-06T00:00:00Z'
  },
  {
    id: '17',
    user_id: '9',
    day_of_week: 'Thursday',
    start_time: '17:00',
    end_time: '21:00',
    created_at: '2023-01-06T00:00:00Z',
    updated_at: '2023-01-06T00:00:00Z'
  },
  {
    id: '18',
    user_id: '9',
    day_of_week: 'Saturday',
    start_time: '10:00',
    end_time: '16:00',
    created_at: '2023-01-06T00:00:00Z',
    updated_at: '2023-01-06T00:00:00Z'
  },
  {
    id: '19',
    user_id: '10',
    day_of_week: 'Wednesday',
    start_time: '18:00',
    end_time: '21:00',
    created_at: '2023-01-07T00:00:00Z',
    updated_at: '2023-01-07T00:00:00Z'
  },
  {
    id: '20',
    user_id: '10',
    day_of_week: 'Friday',
    start_time: '18:00',
    end_time: '21:00',
    created_at: '2023-01-07T00:00:00Z',
    updated_at: '2023-01-07T00:00:00Z'
  },
  {
    id: '21',
    user_id: '10',
    day_of_week: 'Sunday',
    start_time: '14:00',
    end_time: '18:00',
    created_at: '2023-01-07T00:00:00Z',
    updated_at: '2023-01-07T00:00:00Z'
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
  },
  {
    id: '7',
    user_id: '6',
    specialty_type: 'subject',
    specialty_name: 'French Grammar',
    created_at: '2023-01-03T00:00:00Z'
  },
  {
    id: '8',
    user_id: '6',
    specialty_type: 'subject',
    specialty_name: 'Conversation',
    created_at: '2023-01-03T00:00:00Z'
  },
  {
    id: '9',
    user_id: '6',
    specialty_type: 'subject',
    specialty_name: 'Literature',
    created_at: '2023-01-03T00:00:00Z'
  },
  {
    id: '10',
    user_id: '7',
    specialty_type: 'subject',
    specialty_name: 'Calculus',
    created_at: '2023-01-04T00:00:00Z'
  },
  {
    id: '11',
    user_id: '7',
    specialty_type: 'subject',
    specialty_name: 'Mechanics',
    created_at: '2023-01-04T00:00:00Z'
  },
  {
    id: '12',
    user_id: '7',
    specialty_type: 'subject',
    specialty_name: 'Thermodynamics',
    created_at: '2023-01-04T00:00:00Z'
  },
  {
    id: '13',
    user_id: '8',
    specialty_type: 'subject',
    specialty_name: 'World History',
    created_at: '2023-01-05T00:00:00Z'
  },
  {
    id: '14',
    user_id: '8',
    specialty_type: 'subject',
    specialty_name: 'European History',
    created_at: '2023-01-05T00:00:00Z'
  },
  {
    id: '15',
    user_id: '8',
    specialty_type: 'subject',
    specialty_name: 'Human Geography',
    created_at: '2023-01-05T00:00:00Z'
  },
  {
    id: '16',
    user_id: '9',
    specialty_type: 'subject',
    specialty_name: 'Python',
    created_at: '2023-01-06T00:00:00Z'
  },
  {
    id: '17',
    user_id: '9',
    specialty_type: 'subject',
    specialty_name: 'Java',
    created_at: '2023-01-06T00:00:00Z'
  },
  {
    id: '18',
    user_id: '9',
    specialty_type: 'subject',
    specialty_name: 'Web Development',
    created_at: '2023-01-06T00:00:00Z'
  },
  {
    id: '19',
    user_id: '10',
    specialty_type: 'subject',
    specialty_name: 'English Conversation',
    created_at: '2023-01-07T00:00:00Z'
  },
  {
    id: '20',
    user_id: '10',
    specialty_type: 'subject',
    specialty_name: 'Pronunciation',
    created_at: '2023-01-07T00:00:00Z'
  },
  {
    id: '21',
    user_id: '10',
    specialty_type: 'subject',
    specialty_name: 'Grammar',
    created_at: '2023-01-07T00:00:00Z'
  }
];


