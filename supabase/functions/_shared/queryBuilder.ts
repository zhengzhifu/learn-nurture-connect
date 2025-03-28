
// Build Supabase query with filters
export const buildTutorQuery = (supabase: any, query: string, filterParams: any) => {
  // Base query to fetch tutors with their profiles
  let queryBuilder = supabase
    .from('tutors')
    .select(`
      id, bio, hourly_rate, years_of_experience,
      profiles (id, first_name, last_name, email, avatar_url, home_address, approval_status),
      specialties (specialty_name, specialty_type),
      availability (day_of_week, start_time, end_time)
    `);
  
  // Apply search filter if provided
  if (query && query.trim() !== '') {
    queryBuilder = queryBuilder.or(`bio.ilike.%${query}%,profiles.first_name.ilike.%${query}%,profiles.last_name.ilike.%${query}%`);
  }
  
  // Apply type filter if provided
  if (filterParams.types && filterParams.types.length > 0) {
    // In this case all tutors are of type 'tutoring', so no additional filtering needed
  }
  
  // Apply location filter if provided
  if (filterParams.location && filterParams.location.trim() !== '') {
    queryBuilder = queryBuilder.ilike('profiles.home_address', `%${filterParams.location}%`);
  }
  
  // Apply subjects filter if provided
  if (filterParams.subjects && filterParams.subjects.length > 0) {
    // Since we're filtering on a joined table (specialties), we need to use a more complex approach
    // We'll get all tutors that have ANY of the selected subjects (OR condition)
    const subjectFilters = filterParams.subjects.map((subject: string) => {
      // Parse the subject format "category:name"
      const [category, name] = subject.split(':');
      if (!category || !name) return null;
      
      return `and(specialties.specialty_type.eq.${category},specialties.specialty_name.eq.${name})`;
    }).filter(Boolean);
    
    if (subjectFilters.length > 0) {
      queryBuilder = queryBuilder.or(subjectFilters.join(','));
    }
  }
  
  return queryBuilder;
};
