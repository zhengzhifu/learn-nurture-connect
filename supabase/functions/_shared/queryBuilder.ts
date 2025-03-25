
// Build Supabase query with filters
export const buildTutorQuery = (supabase: any, query: string, filterParams: any) => {
  console.log("Building query with search:", query);
  console.log("Filter params:", JSON.stringify(filterParams));
  
  // First run a direct count to verify data exists
  console.log("Running direct count of tutors table...");
  supabase
    .from('tutors')
    .select('*', { count: 'exact', head: true })
    .then((result: any) => {
      console.log("Direct tutor count result:", result?.count, "Error:", result?.error ? JSON.stringify(result.error) : "none");
    });
  
  // Base query to fetch tutors with their profiles
  console.log("Building base query for tutors...");
  let queryBuilder = supabase
    .from('tutors')
    .select(`
      id, bio, hourly_rate, years_of_experience,
      profiles (id, first_name, last_name, email, avatar_url, home_address, approval_status),
      specialties (specialty_name, specialty_type),
      availability (day_of_week, start_time, end_time)
    `);
  
  console.log("Base query constructed for tutors");
  
  // Apply search filter if provided
  if (query && query.trim() !== '') {
    console.log("Applying search query filter:", query);
    queryBuilder = queryBuilder.or(`bio.ilike.%${query}%,profiles.first_name.ilike.%${query}%,profiles.last_name.ilike.%${query}%`);
  }
  
  // Apply type filter if provided
  if (filterParams.types && filterParams.types.length > 0) {
    console.log("Applying type filter:", filterParams.types);
    // In this case all tutors are of type 'tutoring', so no additional filtering needed
  }
  
  // Apply location filter if provided
  if (filterParams.location && filterParams.location.trim() !== '') {
    console.log("Applying location filter:", filterParams.location);
    queryBuilder = queryBuilder.ilike('profiles.home_address', `%${filterParams.location}%`);
  }
  
  // Log query construction completion
  console.log("Query built and ready to execute");
  
  return queryBuilder;
};
