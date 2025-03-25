
// Build Supabase query with filters
export const buildTutorQuery = (supabase: any, query: string, filterParams: any) => {
  console.log("Building query with search:", query);
  console.log("Filter params:", JSON.stringify(filterParams));
  
  // First run a direct raw count of tutors to verify data exists
  console.log("Running direct SQL count of tutors table...");
  supabase.rpc('get_tutor_count').then((result: any) => {
    console.log("Direct SQL count result:", result);
  }).catch((err: any) => {
    console.error("Error in direct SQL count:", err);
  });
  
  // Base query to fetch tutors with their profiles - simplify the query to debug
  console.log("Building base query for tutors...");
  let queryBuilder = supabase
    .from('tutors')
    .select(`
      *,
      profiles!inner(*)
    `);
  
  console.log("Base query constructed for tutors");
  
  // Apply search filter if provided
  if (query && query.trim() !== '') {
    console.log("Applying search query filter:", query);
    queryBuilder = queryBuilder.or(`bio.ilike.%${query}%,profiles.first_name.ilike.%${query}%,profiles.last_name.ilike.%${query}%`);
  }
  
  // Debug the query that's being built
  console.log("Final query built. About to execute it.");
  
  return queryBuilder;
};
