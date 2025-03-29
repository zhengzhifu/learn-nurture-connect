
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Builds a query for tutors based on search query and filters
 */
export function buildTutorQuery(supabase, searchQuery = '', filters = {}) {
  // Start with a base query that joins profiles and tutors
  let query = supabase
    .from('tutors')
    .select(`
      id,
      bio,
      education,
      years_of_experience,
      hourly_rate,
      profiles (
        id,
        first_name,
        last_name,
        user_type,
        avatar_url,
        email,
        phone,
        home_address,
        approval_status,
        school_id,
        latitude,
        longitude
      ),
      specialties (
        id,
        specialty_type,
        specialty_name
      ),
      availability (
        id,
        day_of_week,
        start_time,
        end_time
      )
    `);

  // If there's a search query, add a search condition
  if (searchQuery && searchQuery.trim() !== '') {
    // Split the search query into words for better matching
    const searchTerms = searchQuery.trim().split(/\s+/).filter(Boolean);
    
    // Build an array of search conditions
    const searchConditions = [];
    
    // Add conditions for each term
    searchTerms.forEach(term => {
      searchConditions.push(`profiles.first_name.ilike.%${term}%`);
      searchConditions.push(`profiles.last_name.ilike.%${term}%`);
      searchConditions.push(`tutors.bio.ilike.%${term}%`);
      searchConditions.push(`specialties.specialty_name.ilike.%${term}%`);
    });
    
    // Combine conditions with OR
    if (searchConditions.length > 0) {
      query = query.or(searchConditions.join(','));
    }
  }

  // Apply filters if provided
  if (filters && Object.keys(filters).length > 0) {
    console.log("Applying filters:", filters);
    
    // Filter by service/tutor types
    if (filters.types && filters.types.length > 0) {
      query = query.in('specialties.specialty_type', filters.types);
    }
    
    // Filter by price range
    if (filters.priceRange && filters.priceRange.length === 2) {
      const [minPrice, maxPrice] = filters.priceRange;
      query = query.gte('hourly_rate', minPrice).lte('hourly_rate', maxPrice);
    }
    
    // Filter by subjects
    if (filters.subjects && filters.subjects.length > 0) {
      query = query.in('specialties.specialty_name', filters.subjects);
    }
    
    // Filter by availability
    if (filters.availability && filters.availability.length > 0) {
      query = query.in('availability.day_of_week', filters.availability);
    }
    
    // Filter by location with radius
    if (filters.location && filters.location.trim() !== '') {
      const geocodeResult = await getGeocodedLocation(filters.location);
      
      if (geocodeResult && geocodeResult.latitude && geocodeResult.longitude) {
        const { latitude, longitude } = geocodeResult;
        const radiusKm = filters.radiusKm || 5; // Default to 5km if not specified
        
        console.log(`Searching within ${radiusKm}km of ${latitude}, ${longitude}`);
        
        // Use ST_DWithin to find tutors within the specified radius
        // ST_MakePoint creates a PostGIS point from longitude and latitude
        // ST_SetSRID sets the spatial reference system to WGS84 (EPSG:4326)
        // ST_DWithin checks if the distance between points is within the specified radius
        // The radius is converted from kilometers to meters by multiplying by 1000
        query = query.filter('profiles.latitude', 'not.is', null)
                     .filter('profiles.longitude', 'not.is', null)
                     .filter(`ST_DWithin(
                       ST_SetSRID(ST_MakePoint(profiles.longitude, profiles.latitude), 4326),
                       ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
                       ${radiusKm * 1000}
                     )`);
      } else {
        console.log("Geocoding failed for location:", filters.location);
        // Fall back to simple text matching if geocoding fails
        query = query.ilike('profiles.home_address', `%${filters.location}%`);
      }
    }
  }

  return query;
}

/**
 * Helper function to geocode a location string to coordinates
 */
async function getGeocodedLocation(locationString) {
  try {
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!apiKey) {
      console.error("GOOGLE_MAPS_API_KEY is not set");
      return null;
    }
    
    const encodedAddress = encodeURIComponent(locationString);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng
      };
    }
    
    console.error("Geocoding API error:", data.status);
    return null;
  } catch (error) {
    console.error("Error geocoding location:", error);
    return null;
  }
}
