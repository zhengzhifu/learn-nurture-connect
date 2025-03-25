
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Edge function: get-services received request")
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Parse request body for parameters
    let query = '';
    let filterParams = {};
    
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        console.log("Request body:", JSON.stringify(body));
        query = body.query || '';
        filterParams = body.filters || {};
      } catch (e) {
        console.error('Error parsing request body:', e);
      }
    }
    
    // Get user session if available
    const authHeader = req.headers.get('Authorization')
    let userId = null
    let isApproved = false
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      
      if (user) {
        userId = user.id
        
        // Check if user is approved
        const { data: profileData } = await supabase
          .from('profiles')
          .select('approval_status')
          .eq('id', userId)
          .single()
          
        isApproved = profileData?.approval_status === 'approved'
      }
    }
    
    console.log("Search query:", query);
    console.log("Filter params:", JSON.stringify(filterParams));
    console.log("User authenticated:", !!userId);
    console.log("User approved:", isApproved);
    
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
      `)
    
    // Apply search filter if provided
    if (query) {
      queryBuilder = queryBuilder.or(`bio.ilike.%${query}%,profiles.first_name.ilike.%${query}%,profiles.last_name.ilike.%${query}%`)
    }
    
    // Apply other filters
    if (filterParams.types && filterParams.types.length > 0) {
      // For simplicity, we'll assume all tutors are of type 'tutoring'
      // In a real app, you might have a type field to filter by
    }
    
    if (filterParams.priceRange && filterParams.priceRange.length === 2) {
      const [minPrice, maxPrice] = filterParams.priceRange
      if (minPrice > 0) {
        queryBuilder = queryBuilder.gte('hourly_rate', minPrice)
      }
      if (maxPrice < 100) {
        queryBuilder = queryBuilder.lte('hourly_rate', maxPrice)
      }
    }
    
    if (filterParams.subjects && filterParams.subjects.length > 0) {
      // This is a complex query since we need to filter by specialties
      // For simplicity, we're not implementing this filter in this example
    }
    
    if (filterParams.location && filterParams.location.trim() !== '') {
      // Simple example - not a geographic query
      queryBuilder = queryBuilder.filter('profiles.home_address', 'ilike', `%${filterParams.location}%`)
    }
    
    // Execute the query
    const { data: tutorsData, error } = await queryBuilder
    
    if (error) {
      console.error("Database query error:", error);
      throw error
    }
    
    console.log("Tutors data retrieved:", tutorsData ? tutorsData.length : 0);
    
    // Transform the data into the expected format with proper access control
    const services = tutorsData.map(tutor => {
      // Extract profile data
      const profile = tutor.profiles || {}
      
      // Handle availability
      const availability = tutor.availability 
        ? tutor.availability.map(a => `${a.day_of_week} ${a.start_time}-${a.end_time}`)
        : ['Flexible']
      
      // Handle specialties
      const subjects = tutor.specialties 
        ? tutor.specialties.map(s => s.specialty_name)
        : ['General']
      
      // Determine what fields to show based on authentication status
      const isAuthenticated = !!userId
      
      // Base service object
      const service = {
        id: tutor.id,
        title: `Tutoring Services`,
        description: tutor.bio || 'Professional tutoring services',
        type: 'tutoring',
        price: tutor.hourly_rate || 35,
        rating: 4.5, // Default rating
        location: 'Online', // Default location
        image: null,
        availability: availability,
        subjects: subjects,
      }
      
      // Add fields based on authentication and approval status
      if (isAuthenticated) {
        // Authenticated users can see first name and partial details
        service.provider_name = profile.first_name
        service.image = profile.avatar_url
        
        if (isApproved) {
          // Approved users see most details
          service.provider_name = `${profile.first_name} ${profile.last_name.charAt(0)}.`
          service.provider_id = profile.id
          service.provider_avatar = profile.avatar_url
          service.contact_email = profile.email
          service.contact_phone = profile.phone
          
          // Full address not shown for privacy reasons
          if (profile.home_address) {
            const addressParts = profile.home_address.split(',')
            if (addressParts.length > 1) {
              service.location = addressParts[addressParts.length - 2].trim() + ', ' + 
                               addressParts[addressParts.length - 1].trim()
            }
          }
        }
      }
      
      return service
    })
    
    console.log("Transformed services:", services.length);
    
    return new Response(
      JSON.stringify({ services }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    )
    
  } catch (error) {
    console.error('Error:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    )
  }
})
