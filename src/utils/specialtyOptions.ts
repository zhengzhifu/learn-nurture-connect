
export type SpecialtyCategory = 
  | 'music'
  | 'arts'
  | 'science'
  | 'language'
  | 'social_science'
  | 'humanities'
  | 'math'
  | 'computer_science'
  | 'skills';

export interface SpecialtyOption {
  category: SpecialtyCategory;
  name: string;
  displayName?: string; // Optional display name if different from name
}

export const specialtyOptions: SpecialtyOption[] = [
  { category: 'music', name: 'alto' },
  { category: 'arts', name: 'art' },
  { category: 'science', name: 'biology' },
  { category: 'science', name: 'chemistry' },
  { category: 'language', name: 'chinese' },
  { category: 'social_science', name: 'economics' },
  { category: 'language', name: 'english' },
  { category: 'language', name: 'french' },
  { category: 'social_science', name: 'geography' },
  { category: 'language', name: 'german' },
  { category: 'social_science', name: 'hggsp' },
  { category: 'social_science', name: 'history geography', displayName: 'History & Geography' },
  { category: 'humanities', name: 'hlp' },
  { category: 'humanities', name: 'humanities' },
  { category: 'language', name: 'italian' },
  { category: 'language', name: 'latin' },
  { category: 'math', name: 'mathematics' },
  { category: 'music', name: 'music' },
  { category: 'computer_science', name: 'nsi', displayName: 'NSI' },
  { category: 'skills', name: 'organisation' },
  { category: 'science', name: 'physics' },
  { category: 'science', name: 'science' },
  { category: 'social_science', name: 'social and economic sciences' },
  { category: 'language', name: 'spanish' }
];

// Helper function to get the display name if it exists, otherwise return the name with first letter capitalized
export const getSpecialtyDisplayName = (specialty: SpecialtyOption): string => {
  if (specialty.displayName) {
    return specialty.displayName;
  }
  return specialty.name.charAt(0).toUpperCase() + specialty.name.slice(1);
};

// Get all categories with their display names
export const specialtyCategories: { value: SpecialtyCategory; label: string }[] = [
  { value: 'music', label: 'Music' },
  { value: 'arts', label: 'Arts' },
  { value: 'science', label: 'Science' },
  { value: 'language', label: 'Language' },
  { value: 'social_science', label: 'Social Science' },
  { value: 'humanities', label: 'Humanities' },
  { value: 'math', label: 'Mathematics' },
  { value: 'computer_science', label: 'Computer Science' },
  { value: 'skills', label: 'Skills' }
];

// Get all specialties for a given category
export const getSpecialtiesByCategory = (category: SpecialtyCategory): SpecialtyOption[] => {
  return specialtyOptions.filter(specialty => specialty.category === category);
};

// Format specialty for database storage
export const formatSpecialtyForStorage = (specialty: SpecialtyOption): string => {
  return `${specialty.category}:${specialty.name}`;
};

// Parse specialty from database format
export const parseSpecialtyFromStorage = (specialtyString: string): SpecialtyOption | null => {
  const [category, name] = specialtyString.split(':');
  if (!category || !name) return null;
  
  const found = specialtyOptions.find(
    s => s.category === category && s.name === name
  );
  
  return found || { 
    category: category as SpecialtyCategory, 
    name 
  };
};
