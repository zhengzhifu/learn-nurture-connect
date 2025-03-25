
// Build Supabase query with filters
export const buildTutorQuery = (supabase: any, query: string, filterParams: any) => {
  console.log("Building query with search:", query);
  console.log("Filter params:", JSON.stringify(filterParams));
  
  // Base query to fetch tutors with their profiles
  let queryBuilder = supabase
    .from('tutors')
    .select(`
      id,
      bio,
      hourly_rate,
      years_of_experience,
      profiles (
        id,
        first_name,
        last_name,
        email,
        phone,
        avatar_url,
        home_address,
        approval_status
      ),
      specialties (
        specialty_name,
        specialty_type
      ),
      availability (
        day_of_week,
        start_time,
        end_time
      )
    `);
  
  // Apply search filter if provided
  if (query) {
    queryBuilder = queryBuilder.or(`bio.ilike.%${query}%,profiles.first_name.ilike.%${query}%,profiles.last_name.ilike.%${query}%`);
  }
  
  // Apply other filters
  if (filterParams && filterParams.types && filterParams.types.length > 0) {
    // For simplicity, we'll assume all tutors are of type 'tutoring'
    // In a real app, you might have a type field to filter by
  }
  
  if (filterParams && filterParams.priceRange && filterParams.priceRange.length === 2) {
    const [minPrice, maxPrice] = filterParams.priceRange;
    if (minPrice > 0) {
      queryBuilder = queryBuilder.gte('hourly_rate', minPrice);
    }
    if (maxPrice < 100) {
      queryBuilder = queryBuilder.lte('hourly_rate', maxPrice);
    }
  }
  
  if (filterParams && filterParams.subjects && filterParams.subjects.length > 0) {
    // This is a complex query since we need to filter by specialties
    // For simplicity, we're not implementing this filter in this example
  }
  
  if (filterParams && filterParams.location && filterParams.location.trim() !== '') {
    // Simple example - not a geographic query
    queryBuilder = queryBuilder.filter('profiles.home_address', 'ilike', `%${filterParams.location}%`);
  }
  
  // Important: Debug the query that's being built
  console.log("Final query built. About to execute it.");
  
  return queryBuilder;
};
