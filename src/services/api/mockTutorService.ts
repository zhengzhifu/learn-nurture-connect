
import { Profile } from '@/types/auth';

// Define the Tutor interface which extends Profile with additional tutor-specific properties
export interface Tutor extends Profile {
  subjects: string[];
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  availability: string[];
  bio: string;
  isBookmarked: boolean;
}

// Mock tutors data
export const MOCK_TUTORS: Tutor[] = [
  {
    id: '101',
    full_name: 'Emily Johnson',
    email: 'emily.j@example.com',
    user_type: 'tutor',
    phone: '123-456-7890',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    verified: true,
    subjects: ['Mathematics', 'Physics', 'Calculus'],
    hourlyRate: 35,
    rating: 4.9,
    reviewCount: 24,
    availability: ['Weekdays afternoons', 'Weekends'],
    bio: 'Math specialist with 5+ years of teaching experience. I focus on making complex concepts easy to understand.',
    isBookmarked: true
  },
  {
    id: '102',
    full_name: 'Michael Chen',
    email: 'michael.c@example.com',
    user_type: 'tutor',
    phone: '234-567-8901',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    verified: true,
    subjects: ['Chemistry', 'Biology', 'Science'],
    hourlyRate: 40,
    rating: 4.8,
    reviewCount: 19,
    availability: ['Weekends', 'Weeknights'],
    bio: 'Passionate about making science accessible to all students. PhD candidate in Biochemistry.',
    isBookmarked: false
  },
  {
    id: '103',
    full_name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    user_type: 'tutor',
    phone: '345-678-9012',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    verified: true,
    subjects: ['English Literature', 'Writing', 'Grammar'],
    hourlyRate: 30,
    rating: 4.7,
    reviewCount: 31,
    availability: ['Weekdays', 'Flexible hours'],
    bio: 'English teacher with a focus on essay writing and literary analysis. I help students find their voice.',
    isBookmarked: true
  },
  {
    id: '104',
    full_name: 'David Martinez',
    email: 'david.m@example.com',
    user_type: 'tutor',
    phone: '456-789-0123',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    verified: false,
    subjects: ['Computer Science', 'Programming', 'Web Development'],
    hourlyRate: 45,
    rating: 4.6,
    reviewCount: 12,
    availability: ['Evenings', 'Weekends'],
    bio: 'Software engineer by day, programming tutor by night. I specialize in teaching practical coding skills.',
    isBookmarked: false
  }
];

// Mock Tutor Service class
export class MockTutorService {
  // Get all tutors for a user
  async getUserTutors(userId: string): Promise<Tutor[]> {
    console.log('MockTutorService: getUserTutors called for user:', userId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real application, we would filter tutors related to the specific user
    // For mock purposes, we're returning all tutors
    console.log(`MockTutorService: returning ${MOCK_TUTORS.length} tutors`);
    return MOCK_TUTORS;
  }
  
  // Get a specific tutor by ID
  async getTutorById(tutorId: string): Promise<Tutor | null> {
    console.log('MockTutorService: getTutorById called for tutor:', tutorId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tutor = MOCK_TUTORS.find(t => t.id === tutorId) || null;
    console.log(`MockTutorService: ${tutor ? 'Found' : 'Did not find'} tutor with ID ${tutorId}`);
    return tutor;
  }
  
  // Toggle bookmark status for a tutor
  async toggleTutorBookmark(tutorId: string, userId: string): Promise<boolean> {
    console.log(`MockTutorService: toggleTutorBookmark called for tutor ${tutorId} and user ${userId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // In a real implementation, this would update a database record
    // For mock purposes, we'll just return success
    console.log('MockTutorService: bookmark toggled successfully');
    return true;
  }
}

// Create and export a singleton instance
export const mockTutorService = new MockTutorService();
