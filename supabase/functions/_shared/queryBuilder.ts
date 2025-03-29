
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

export function buildTutorQuery(supabase, searchQuery = '', filters = {}) {
  console.log("Building base query for tutors...");
  
  // Start with a base query that includes all necessary joins
  const baseQuery = supabase
    .from('tutors')
    .select(`
      id,
      bio,
      hourly_rate,
      years_of_experience,
      profiles!inner(
        id, 
        first_name, 
        last_name, 
        email, 
        phone, 
        avatar_url, 
        home_address,
        school_id,
        approval_status
      ),
      specialties:tutor_specialties(
        specialty_type,
        specialty_name
      ),
      availability:tutor_availability(
        day_of_week,
        start_time,
        end_time
      )
    `);
  
  console.log("Base query constructed for tutors");
  
  // Apply search query if provided
  if (searchQuery && searchQuery.trim() !== '') {
    baseQuery.or(`
      profiles.first_name.ilike.%${searchQuery}%,
      profiles.last_name.ilike.%${searchQuery}%,
      bio.ilike.%${searchQuery}%
    `);
  }
  
  // Apply filters if provided
  if (filters) {
    // Filter by service type (currently all tutors are of type 'tutoring')
    if (filters.types && filters.types.length > 0) {
      // All services in the tutors table are 'tutoring' for now
      // This is a placeholder for future differentiation of service types
    }
    
    // Filter by location
    if (filters.location && filters.location.trim() !== '') {
      // Extract address components from the location filter
      try {
        // Extract city and state from formatted address if available
        const locationText = filters.location.toLowerCase();
        baseQuery.filter('profiles.home_address', 'ilike', `%${locationText}%`);
      } catch (error) {
        console.error("Error parsing location filter:", error);
      }
    }
    
    // Filter by radius - requires geocoding the address and calculating distance
    // This would normally require PostGIS extension and more complex queries
    // For now, we're only filtering by address string match
    
    // Filter by price range
    if (filters.priceRange && Array.isArray(filters.priceRange) && filters.priceRange.length === 2) {
      const [minPrice, maxPrice] = filters.priceRange;
      if (minPrice > 0) {
        baseQuery.gte('hourly_rate', minPrice);
      }
      if (maxPrice < 100) {
        baseQuery.lte('hourly_rate', maxPrice);
      }
    }
    
    // Filter by subjects/specialties
    if (filters.subjects && filters.subjects.length > 0) {
      // Join with tutor_specialties to filter by subjects
      // This query approach may need optimization for larger datasets
      const specialtyConditions = filters.subjects.map(subject => {
        // Parse the subject format: "type:name"
        let specialtyType, specialtyName;
        
        if (subject.includes(':')) {
          [specialtyType, specialtyName] = subject.split(':');
        } else {
          // If not in the expected format, assume it's the specialty name
          specialtyName = subject;
        }
        
        // Build the filter condition based on available parts
        if (specialtyType && specialtyName) {
          return `specialty_type.eq.${specialtyType}.and.specialty_name.eq.${specialtyName}`;
        } else {
          return `specialty_name.eq.${specialtyName}`;
        }
      });
      
      baseQuery.filter('specialties.specialty_name', 'in', `(${filters.subjects.join(',')})`);
    }
    
    // Filter by availability
    if (filters.availability && filters.availability.length > 0) {
      // Filter tutors who are available on the specified days
      baseQuery.filter('availability.day_of_week', 'in', `(${filters.availability.join(',')})`);
    }
  }
  
  console.log("Query built and ready to execute");
  return baseQuery;
}
