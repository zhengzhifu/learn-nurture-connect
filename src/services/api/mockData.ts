import { Profile, School, Availability, Specialty, ApprovalStatus } from '@/types/auth';

// Mock profiles with first_name and last_name
export const mockProfiles: Profile[] = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Parent',
    full_name: 'John Parent', // For backward compatibility
    email: 'john.parent@example.com',
    user_type: 'parent',
    phone: '555-123-4567',
    avatar_url: 'https://i.pravatar.cc/150?u=1',
    home_address: '123 Family St, Parentville, NY 10001',
    verified: true,
    approval_status: 'approved',
    school_id: '2',
    child_school_id: '1'
  },
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Tutor',
    full_name: 'Jane Tutor', // For backward compatibility
    email: 'jane.tutor@example.com',
    user_type: 'tutor',
    phone: '555-987-6543',
    avatar_url: 'https://i.pravatar.cc/150?u=2',
    home_address: '456 Teacher Ave, Tutortown, CA 90210',
    verified: true,
    approval_status: 'approved',
    school_id: '1'
  },
  {
    id: '3',
    first_name: 'Robert',
    last_name: 'Smith',
    full_name: 'Robert Smith', // For backward compatibility
    email: 'robert.smith@example.com',
    user_type: 'parent',
    phone: '555-444-3333',
    avatar_url: 'https://i.pravatar.cc/150?u=3',
    home_address: '789 Parent Rd, Familytown, IL 60007',
    verified: false,
    approval_status: 'pending',
    school_id: '3',
    child_school_id: '1'
  },
  {
    id: '4',
    first_name: 'Alice',
    last_name: 'Johnson',
    full_name: 'Alice Johnson', // For backward compatibility
    email: 'alice.johnson@example.com',
    user_type: 'tutor',
    phone: '555-222-1111',
    avatar_url: 'https://i.pravatar.cc/150?u=4',
    home_address: '321 Tutor Blvd, Teacherville, TX 75001',
    verified: true,
    approval_status: 'approved',
    school_id: '1'
  },
  {
    id: '5',
    first_name: 'Admin',
    last_name: 'User',
    full_name: 'Admin User', // For backward compatibility
    email: 'admin@example.com',
    user_type: 'admin',
    phone: '555-999-8888',
    avatar_url: 'https://i.pravatar.cc/150?u=5',
    home_address: '1 Admin Plaza, Systemtown, CA 94105',
    verified: true,
    approval_status: 'approved'
  },
  {
    id: '6',
    first_name: 'Michael',
    last_name: 'Tutor',
    full_name: 'Michael Tutor', // For backward compatibility
    email: 'michael.tutor@example.com',
    user_type: 'tutor',
    phone: '555-777-6666',
    avatar_url: 'https://i.pravatar.cc/150?u=6',
    home_address: '555 Education St, Schooltown, NY 10012',
    verified: true,
    approval_status: 'approved',
    school_id: '2'
  },
  {
    id: '7',
    first_name: 'Lisa',
    last_name: 'Math',
    full_name: 'Lisa Math', // For backward compatibility
    email: 'lisa.math@example.com',
    user_type: 'tutor',
    phone: '555-666-5555',
    avatar_url: 'https://i.pravatar.cc/150?u=7',
    home_address: '777 Algebra Ave, Mathtown, CA 92868',
    verified: true,
    approval_status: 'approved',
    school_id: '3'
  },
  {
    id: '8',
    first_name: 'David',
    last_name: 'Science',
    full_name: 'David Science', // For backward compatibility
    email: 'david.science@example.com',
    user_type: 'tutor',
    phone: '555-444-3333',
    avatar_url: 'https://i.pravatar.cc/150?u=8',
    home_address: '888 Chemistry Rd, Scienceville, IL 60085',
    verified: true,
    approval_status: 'approved',
    school_id: '4'
  },
  {
    id: '9',
    first_name: 'Sarah',
    last_name: 'English',
    full_name: 'Sarah English', // For backward compatibility
    email: 'sarah.english@example.com',
    user_type: 'tutor',
    phone: '555-333-2222',
    avatar_url: 'https://i.pravatar.cc/150?u=9',
    home_address: '999 Literature Ln, Grammartown, TX 75201',
    verified: true,
    approval_status: 'approved',
    school_id: '1'
  },
  {
    id: '10',
    first_name: 'James',
    last_name: 'History',
    full_name: 'James History', // For backward compatibility
    email: 'james.history@example.com',
    user_type: 'tutor',
    phone: '555-222-1111',
    avatar_url: 'https://i.pravatar.cc/150?u=10',
    home_address: '111 Ancient Ave, Historicalville, NY 10014',
    verified: true,
    approval_status: 'approved',
    school_id: '2'
  }
];

// Mock schools
export const mockSchools: School[] = [
  {
    id: '1',
    name: 'Riverside Elementary School',
    address: '123 School Ave, Riverside, CA 92506',
    status: 'approved',
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Central High School',
    address: '456 Education Blvd, Central City, NY 10001',
    status: 'approved',
    created_at: '2023-01-16T00:00:00Z',
    updated_at: '2023-01-16T00:00:00Z'
  },
  {
    id: '3',
    name: 'Westside Middle School',
    address: '789 Learning Dr, Westside, IL 60007',
    status: 'approved',
    created_at: '2023-01-17T00:00:00Z',
    updated_at: '2023-01-17T00:00:00Z'
  },
  {
    id: '4',
    name: 'Easttown Academy',
    address: '987 Knowledge St, Easttown, TX 75001',
    status: 'approved',
    created_at: '2023-01-18T00:00:00Z',
    updated_at: '2023-01-18T00:00:00Z'
  },
  {
    id: '5',
    name: 'Northview Charter School',
    address: '654 Charter Way, Northview, CA 94105',
    status: 'pending',
    created_at: '2023-01-19T00:00:00Z',
    updated_at: '2023-01-19T00:00:00Z'
  },
  {
    id: '6',
    name: 'Southside Montessori',
    address: '321 Montessori Circle, Southside, NY 10012',
    status: 'pending',
    created_at: '2023-01-20T00:00:00Z',
    updated_at: '2023-01-20T00:00:00Z'
  },
];

// Mock availability data
export const mockAvailabilities: Availability[] = [
  {
    id: '1',
    tutor_id: '2',
    day_of_week: 'Monday',
    start_time: '09:00',
    end_time: '12:00',
    created_at: '2023-02-01T00:00:00Z',
    updated_at: '2023-02-01T00:00:00Z'
  },
  {
    id: '2',
    tutor_id: '2',
    day_of_week: 'Monday',
    start_time: '13:00',
    end_time: '17:00',
    created_at: '2023-02-01T00:00:00Z',
    updated_at: '2023-02-01T00:00:00Z'
  },
  {
    id: '3',
    tutor_id: '2',
    day_of_week: 'Wednesday',
    start_time: '09:00',
    end_time: '15:00',
    created_at: '2023-02-01T00:00:00Z',
    updated_at: '2023-02-01T00:00:00Z'
  },
  {
    id: '4',
    tutor_id: '2',
    day_of_week: 'Friday',
    start_time: '10:00',
    end_time: '14:00',
    created_at: '2023-02-01T00:00:00Z',
    updated_at: '2023-02-01T00:00:00Z'
  },
  {
    id: '5',
    tutor_id: '4',
    day_of_week: 'Tuesday',
    start_time: '08:00',
    end_time: '12:00',
    created_at: '2023-02-02T00:00:00Z',
    updated_at: '2023-02-02T00:00:00Z'
  },
  {
    id: '6',
    tutor_id: '4',
    day_of_week: 'Thursday',
    start_time: '14:00',
    end_time: '18:00',
    created_at: '2023-02-02T00:00:00Z',
    updated_at: '2023-02-02T00:00:00Z'
  },
  {
    id: '7',
    tutor_id: '6',
    day_of_week: 'Tuesday',
    start_time: '16:00',
    end_time: '20:00',
    created_at: '2023-02-03T00:00:00Z',
    updated_at: '2023-02-03T00:00:00Z'
  },
  {
    id: '8',
    tutor_id: '7',
    day_of_week: 'Wednesday',
    start_time: '18:00',
    end_time: '21:00',
    created_at: '2023-02-04T00:00:00Z',
    updated_at: '2023-02-04T00:00:00Z'
  },
  {
    id: '9',
    tutor_id: '8',
    day_of_week: 'Thursday',
    start_time: '08:00',
    end_time: '11:00',
    created_at: '2023-02-05T00:00:00Z',
    updated_at: '2023-02-05T00:00:00Z'
  },
  {
    id: '10',
    tutor_id: '9',
    day_of_week: 'Friday',
    start_time: '15:00',
    end_time: '19:00',
    created_at: '2023-02-06T00:00:00Z',
    updated_at: '2023-02-06T00:00:00Z'
  },
  {
    id: '11',
    tutor_id: '10',
    day_of_week: 'Saturday',
    start_time: '10:00',
    end_time: '16:00',
    created_at: '2023-02-07T00:00:00Z',
    updated_at: '2023-02-07T00:00:00Z'
  },
  {
    id: '12',
    tutor_id: '6',
    day_of_week: 'Sunday',
    start_time: '14:00',
    end_time: '17:00',
    created_at: '2023-02-08T00:00:00Z',
    updated_at: '2023-02-08T00:00:00Z'
  },
  {
    id: '13',
    tutor_id: '7',
    day_of_week: 'Saturday',
    start_time: '09:00',
    end_time: '12:00',
    created_at: '2023-02-09T00:00:00Z',
    updated_at: '2023-02-09T00:00:00Z'
  },
  {
    id: '14',
    tutor_id: '8',
    day_of_week: 'Sunday',
    start_time: '13:00',
    end_time: '16:00',
    created_at: '2023-02-10T00:00:00Z',
    updated_at: '2023-02-10T00:00:00Z'
  },
  {
    id: '15',
    tutor_id: '9',
    day_of_week: 'Monday',
    start_time: '17:00',
    end_time: '20:00',
    created_at: '2023-02-11T00:00:00Z',
    updated_at: '2023-02-11T00:00:00Z'
  },
  {
    id: '16',
    tutor_id: '10',
    day_of_week: 'Tuesday',
    start_time: '19:00',
    end_time: '22:00',
    created_at: '2023-02-12T00:00:00Z',
    updated_at: '2023-02-12T00:00:00Z'
  }
];

// Mock specialties
export const mockSpecialties: Specialty[] = [
  {
    id: '1',
    tutor_id: '2', 
    specialty_type: 'subject',
    specialty_name: 'Math',
    created_at: '2023-03-01T00:00:00Z'
  },
  {
    id: '2',
    tutor_id: '2',
    specialty_type: 'subject',
    specialty_name: 'Physics',
    created_at: '2023-03-01T00:00:00Z'
  },
  {
    id: '3',
    tutor_id: '2',
    specialty_type: 'grade',
    specialty_name: 'High School',
    created_at: '2023-03-01T00:00:00Z'
  },
  {
    id: '4',
    tutor_id: '4',
    specialty_type: 'subject',
    specialty_name: 'Computer Science',
    created_at: '2023-03-02T00:00:00Z'
  },
  {
    id: '5',
    tutor_id: '4',
    specialty_type: 'subject',
    specialty_name: 'Programming',
    created_at: '2023-03-02T00:00:00Z'
  },
  {
    id: '6',
    tutor_id: '4',
    specialty_type: 'grade',
    specialty_name: 'College',
    created_at: '2023-03-02T00:00:00Z'
  },
  {
    id: '7',
    tutor_id: '6',
    specialty_type: 'subject',
    specialty_name: 'Statistics',
    created_at: '2023-03-03T00:00:00Z'
  },
  {
    id: '8',
    tutor_id: '6',
    specialty_type: 'subject',
    specialty_name: 'Calculus',
    created_at: '2023-03-03T00:00:00Z'
  },
  {
    id: '9',
    tutor_id: '7',
    specialty_type: 'subject',
    specialty_name: 'Geometry',
    created_at: '2023-03-04T00:00:00Z'
  },
  {
    id: '10',
    tutor_id: '8',
    specialty_type: 'subject',
    specialty_name: 'Biology',
    created_at: '2023-03-05T00:00:00Z'
  },
  {
    id: '11',
    tutor_id: '9',
    specialty_type: 'subject',
    specialty_name: 'Literature',
    created_at: '2023-03-06T00:00:00Z'
  },
  {
    id: '12',
    tutor_id: '10',
    specialty_type: 'subject',
    specialty_name: 'World History',
    created_at: '2023-03-07T00:00:00Z'
  },
  {
    id: '13',
    tutor_id: '7',
    specialty_type: 'grade',
    specialty_name: 'Middle School',
    created_at: '2023-03-04T00:00:00Z'
  },
  {
    id: '14',
    tutor_id: '8',
    specialty_type: 'grade',
    specialty_name: 'Elementary School',
    created_at: '2023-03-05T00:00:00Z'
  },
  {
    id: '15',
    tutor_id: '9',
    specialty_type: 'grade',
    specialty_name: 'High School',
    created_at: '2023-03-06T00:00:00Z'
  },
  {
    id: '16',
    tutor_id: '10',
    specialty_type: 'grade',
    specialty_name: 'College',
    created_at: '2023-03-07T00:00:00Z'
  },
  {
    id: '17',
    tutor_id: '6',
    specialty_type: 'level',
    specialty_name: 'Beginner',
    created_at: '2023-03-03T00:00:00Z'
  },
  {
    id: '18',
    tutor_id: '7',
    specialty_type: 'level',
    specialty_name: 'Intermediate',
    created_at: '2023-03-04T00:00:00Z'
  },
  {
    id: '19',
    tutor_id: '8',
    specialty_type: 'level',
    specialty_name: 'Advanced',
    created_at: '2023-03-05T00:00:00Z'
  },
  {
    id: '20',
    tutor_id: '9',
    specialty_type: 'level',
    specialty_name: 'Expert',
    created_at: '2023-03-06T00:00:00Z'
  },
  {
    id: '21',
    tutor_id: '10',
    specialty_type: 'exam',
    specialty_name: 'SAT',
    created_at: '2023-03-07T00:00:00Z'
  },
  {
    id: '22',
    tutor_id: '6',
    specialty_type: 'exam',
    specialty_name: 'ACT',
    created_at: '2023-03-03T00:00:00Z'
  }
];
