// Add the mockServices export to fix the import error in mockServiceListingService.ts
export const mockServices = [
  {
    id: 'service-1',
    title: 'Math Tutoring with John Smith',
    description: 'Math tutoring services for elementary and middle school students.',
    type: 'tutoring',
    price: 35,
    rating: 4.8,
    location: 'Online',
    image: '/placeholder.svg',
    availability: ['Weekdays', 'Weekends'],
    provider_id: 'tutor-1',
    subjects: ['Math', 'Science'],
    provider_name: 'John Smith',
    provider_avatar: '/placeholder.svg'
  },
  {
    id: 'service-2',
    title: 'English Tutoring with Jane Doe',
    description: 'English and literature tutoring for high school students.',
    type: 'tutoring',
    price: 40,
    rating: 4.9,
    location: 'Online',
    image: '/placeholder.svg',
    availability: ['Weekdays'],
    provider_id: 'tutor-2',
    subjects: ['English', 'Literature'],
    provider_name: 'Jane Doe',
    provider_avatar: '/placeholder.svg'
  },
  {
    id: 'service-3',
    title: 'Science Tutoring with Dr. Brown',
    description: 'Science tutoring for high school and college students.',
    type: 'tutoring',
    price: 45,
    rating: 4.7,
    location: 'In-person',
    image: '/placeholder.svg',
    availability: ['Weekdays', 'Evenings'],
    provider_id: 'tutor-3',
    subjects: ['Biology', 'Chemistry', 'Physics'],
    provider_name: 'Dr. Brown',
    provider_avatar: '/placeholder.svg'
  },
  {
    id: 'service-4',
    title: 'History Tutoring with Professor White',
    description: 'History and social studies tutoring for all grade levels.',
    type: 'tutoring',
    price: 38,
    rating: 4.6,
    location: 'Online',
    image: '/placeholder.svg',
    availability: ['Weekends'],
    provider_id: 'tutor-4',
    subjects: ['History', 'Social Studies'],
    provider_name: 'Professor White',
    provider_avatar: '/placeholder.svg'
  },
  {
    id: 'service-5',
    title: 'Computer Science with Tech Expert',
    description: 'Programming and computer science tutoring for students of all levels.',
    type: 'tutoring',
    price: 50,
    rating: 4.9,
    location: 'Online',
    image: '/placeholder.svg',
    availability: ['Evenings', 'Weekends'],
    provider_id: 'tutor-5',
    subjects: ['Programming', 'Computer Science'],
    provider_name: 'Tech Expert',
    provider_avatar: '/placeholder.svg'
  }
];

// Mock profiles for testing
export const mockProfiles = [
  {
    id: 'user-1',
    first_name: 'John',
    last_name: 'Smith',
    full_name: 'John Smith',
    email: 'john@example.com',
    user_type: 'tutor',
    phone: '555-123-4567',
    avatar_url: '/placeholder.svg',
    verified: true,
    home_address: '123 Main St, Anytown, USA',
    approval_status: 'approved',
    school_id: 'school-1',
    other_school_name: '',
    child_school_id: ''
  },
  {
    id: 'user-2',
    first_name: 'Jane',
    last_name: 'Doe',
    full_name: 'Jane Doe',
    email: 'jane@example.com',
    user_type: 'parent',
    phone: '555-987-6543',
    avatar_url: '/placeholder.svg',
    verified: true,
    home_address: '456 Oak St, Somewhere, USA',
    approval_status: 'approved',
    school_id: '',
    other_school_name: 'Homeschool',
    child_school_id: 'school-2'
  },
  {
    id: 'user-3',
    first_name: 'Admin',
    last_name: 'User',
    full_name: 'Admin User',
    email: 'admin@example.com',
    user_type: 'admin',
    phone: '555-111-2222',
    avatar_url: '/placeholder.svg',
    verified: true,
    home_address: '789 Admin Ave, Adminville, USA',
    approval_status: 'approved',
    school_id: '',
    other_school_name: '',
    child_school_id: ''
  }
];

// Mock reviews for testing
export const mockReviews = [
  {
    id: 'review-1',
    reviewer_id: 'user-2',
    reviewee_id: 'user-1',
    rating: 5,
    comment: 'Excellent tutor! My child improved significantly.',
    subject: 'Math',
    created_at: '2023-01-15T12:00:00Z',
    reviewer_name: 'Jane Doe',
    reviewer_avatar: '/placeholder.svg'
  },
  {
    id: 'review-2',
    reviewer_id: 'user-3',
    reviewee_id: 'user-1',
    rating: 4,
    comment: 'Very knowledgeable and patient.',
    subject: 'Science',
    created_at: '2023-02-20T14:30:00Z',
    reviewer_name: 'Admin User',
    reviewer_avatar: '/placeholder.svg'
  },
  {
    id: 'review-3',
    reviewer_id: 'user-2',
    reviewee_id: 'user-1',
    rating: 5,
    comment: 'Helped my child prepare for SAT. Great results!',
    subject: 'Test Prep',
    created_at: '2023-03-10T09:15:00Z',
    reviewer_name: 'Jane Doe',
    reviewer_avatar: '/placeholder.svg'
  }
];

// Mock schools for testing
export const mockSchools = [
  {
    id: 'school-1',
    name: 'Anytown High School',
    address: '100 School Rd, Anytown, USA',
    status: 'approved',
    created_at: '2022-01-01T00:00:00Z',
    updated_at: '2022-01-01T00:00:00Z'
  },
  {
    id: 'school-2',
    name: 'Somewhere Elementary',
    address: '200 Education Ln, Somewhere, USA',
    status: 'approved',
    created_at: '2022-01-02T00:00:00Z',
    updated_at: '2022-01-02T00:00:00Z'
  },
  {
    id: 'school-3',
    name: 'New School Application',
    address: '300 New Ave, Newtown, USA',
    status: 'pending',
    created_at: '2023-05-15T00:00:00Z',
    updated_at: '2023-05-15T00:00:00Z'
  }
];

// Mock availability for testing
export const mockAvailability = [
  {
    id: 'avail-1',
    tutor_id: 'user-1',
    day_of_week: 'Monday',
    start_time: '15:00',
    end_time: '18:00',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'avail-2',
    tutor_id: 'user-1',
    day_of_week: 'Wednesday',
    start_time: '15:00',
    end_time: '18:00',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'avail-3',
    tutor_id: 'user-1',
    day_of_week: 'Friday',
    start_time: '16:00',
    end_time: '20:00',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
];

// Mock specialties for testing
export const mockSpecialties = [
  {
    id: 'spec-1',
    tutor_id: 'user-1',
    specialty_type: 'subject',
    specialty_name: 'Algebra',
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'spec-2',
    tutor_id: 'user-1',
    specialty_type: 'subject',
    specialty_name: 'Calculus',
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'spec-3',
    tutor_id: 'user-1',
    specialty_type: 'grade_level',
    specialty_name: 'High School',
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'spec-4',
    tutor_id: 'user-1',
    specialty_type: 'test_prep',
    specialty_name: 'SAT Math',
    created_at: '2023-01-01T00:00:00Z'
  }
];
