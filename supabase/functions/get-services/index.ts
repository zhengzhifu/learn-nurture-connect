
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'
import { transformTutorToService, handleApiError } from '../_shared/tutorTransformer.ts'
import { buildTutorQuery } from '../_shared/queryBuilder.ts'
import { getUserAuthInfo } from '../_shared/auth.ts'

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
    
    // Get user authentication info
    const authHeader = req.headers.get('Authorization')
    const { userId, isApproved } = await getUserAuthInfo(supabase, authHeader);
    
    // Build and execute query
    const queryBuilder = buildTutorQuery(supabase, query, filterParams);
    const { data: tutorsData, error } = await queryBuilder;
    
    if (error) {
      console.error("Database query error:", error);
      throw error;
    }
    
    console.log("Tutors data retrieved:", tutorsData ? tutorsData.length : 0);
    
    // Transform the data with access control based on authentication
    const services = tutorsData.map(tutor => 
      transformTutorToService(tutor, !!userId, isApproved)
    );
    
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
    );
    
  } catch (error) {
    return handleApiError(error);
  }
});
