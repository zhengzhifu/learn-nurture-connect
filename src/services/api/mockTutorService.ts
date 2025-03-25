
import { Tutor } from '@/types/auth';

// Define the mock tutor data
export const mockTutors: Tutor[] = [
  {
    id: "tutor-1",
    first_name: "Jane",
    last_name: "Doe",
    full_name: "Jane Doe",
    email: "jane.doe@example.com",
    user_type: "tutor",
    phone: "555-123-4567",
    avatar_url: "https://i.pravatar.cc/150?u=janedoe",
    verified: true,
    subjects: ["Math", "Science", "Physics"],
    hourlyRate: 45,
    rating: 4.8,
    reviewCount: 24,
    availability: ["Weekdays", "Weekends"],
    bio: "Experienced math and science tutor with a PhD in Physics.",
    isBookmarked: true
  },
  {
    id: "tutor-2",
    first_name: "John",
    last_name: "Smith",
    full_name: "John Smith",
    email: "john.smith@example.com",
    user_type: "tutor",
    phone: "555-987-6543",
    avatar_url: "https://i.pravatar.cc/150?u=johnsmith",
    verified: true,
    subjects: ["English", "Literature", "Writing"],
    hourlyRate: 40,
    rating: 4.6,
    reviewCount: 18,
    availability: ["Weekdays"],
    bio: "English literature expert with 10 years of teaching experience.",
    isBookmarked: false
  },
  {
    id: "tutor-3",
    first_name: "Maria",
    last_name: "Garcia",
    full_name: "Maria Garcia",
    email: "maria.garcia@example.com",
    user_type: "tutor",
    phone: "555-456-7890",
    avatar_url: "https://i.pravatar.cc/150?u=mariagarcia",
    verified: true,
    subjects: ["Spanish", "French", "ESL"],
    hourlyRate: 50,
    rating: 4.9,
    reviewCount: 32,
    availability: ["Weekdays", "Weekends"],
    bio: "Multilingual language instructor specialized in Spanish and French.",
    isBookmarked: true
  },
  {
    id: "tutor-4",
    first_name: "David",
    last_name: "Wang",
    full_name: "David Wang",
    email: "david.wang@example.com",
    user_type: "tutor",
    phone: "555-111-2222",
    avatar_url: "https://i.pravatar.cc/150?u=davidwang",
    verified: false,
    subjects: ["Computer Science", "Programming", "Math"],
    hourlyRate: 55,
    rating: 4.5,
    reviewCount: 12,
    availability: ["Weekends"],
    bio: "Software engineer teaching programming and computer science concepts.",
    isBookmarked: false
  }
];

export const getTutorById = (id: string): Tutor | undefined => {
  return mockTutors.find(tutor => tutor.id === id);
};

export const getAllTutors = (): Tutor[] => {
  return mockTutors;
};

export const getFilteredTutors = (subject?: string, maxRate?: number): Tutor[] => {
  return mockTutors.filter(tutor => {
    // Apply subject filter if provided
    const subjectMatch = !subject || tutor.subjects?.includes(subject);
    
    // Apply rate filter if provided
    const rateMatch = !maxRate || (tutor.hourlyRate !== undefined && tutor.hourlyRate <= maxRate);
    
    return subjectMatch && rateMatch;
  });
};
