
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Required for CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchParams {
  query?: string;
  types?: string[];
  location?: string;
  priceRange?: [number, number];
  subjects?: string[];
  availability?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the project URL and anon key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get search parameters from request
    const params: SearchParams = await req.json();
    console.log('Search params:', params);

    // Start with a base query
    let query = supabase
      .from('tutor_services')
      .select(`
        *,
        tutor:profiles!inner(
          id,
          full_name,
          avatar_url
        )
      `);

    // Apply filters based on the params
    if (params.query) {
      query = query.or(`service_type.ilike.%${params.query}%,location_address.ilike.%${params.query}%`);
    }

    if (params.types && params.types.length > 0) {
      const typeConditions = params.types.map(type => `service_type.ilike.%${type}%`).join(',');
      query = query.or(typeConditions);
    }

    if (params.location) {
      query = query.ilike('location_address', `%${params.location}%`);
    }

    if (params.priceRange) {
      const [min, max] = params.priceRange;
      query = query.gte('hourly_rate', min).lte('hourly_rate', max);
    }

    // Execute the query
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching services:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Client-side filtering for subjects and availability if needed
    let filteredData = data;
    
    if (params.subjects && params.subjects.length > 0) {
      filteredData = filteredData.filter(service => 
        service.tutoring_subjects?.some((subject: string) => 
          params.subjects?.includes(subject)
        )
      );
    }
    
    if (params.availability && params.availability.length > 0) {
      filteredData = filteredData.filter(service => {
        const serviceAvailability = typeof service.availability === 'object' 
          ? Object.values(service.availability).map(item => item.toString())
          : Array.isArray(service.availability) 
            ? service.availability.map(item => item.toString())
            : [];
            
        return serviceAvailability.some(slot => 
          params.availability?.includes(slot)
        );
      });
    }

    // Transform the data to match the ServiceData structure
    const transformedServices = filteredData.map(service => {
      return {
        id: service.id,
        title: `${service.service_type.includes('tutoring') ? 'Tutoring' : 'Babysitting'} Service`,
        description: `${service.service_type} service in ${service.location_address || 'Various locations'}`,
        type: service.service_type.includes('tutoring') ? 'tutoring' : 'babysitting',
        price: service.hourly_rate ? Number(service.hourly_rate) : 0,
        rating: 4.5, // Default rating
        location: service.location_address || 'Various locations',
        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop', // Default image
        availability: typeof service.availability === 'object' 
          ? Object.values(service.availability).map(item => item.toString())
          : Array.isArray(service.availability) 
            ? service.availability.map(item => item.toString())
            : [],
        provider_id: service.tutor_id,
        subjects: service.tutoring_subjects || [],
        provider_name: service.tutor?.full_name || 'Unknown Provider',
        provider_avatar: service.tutor?.avatar_url
      };
    });

    console.log(`Found ${transformedServices.length} services`);

    return new Response(JSON.stringify(transformedServices), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Exception in edge function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
