
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
        // Check if the request has a body before trying to parse it
        const contentType = req.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          // Clone the request to ensure we can read the body
          const clonedReq = req.clone();
          const text = await clonedReq.text();
          
          console.log("Request body text:", text);
          
          if (text && text.trim() !== '') {
            const body = JSON.parse(text);
            console.log("Parsed body:", JSON.stringify(body));
            query = body.query || '';
            filterParams = body.filters || {};
          } else {
            console.log("Request body is empty");
          }
        } else {
          console.log("Request is not JSON or content-type header is missing");
        }
      } catch (e) {
        console.error('Error parsing request body:', e);
        // Continue with empty parameters rather than failing
      }
    }
    
    // Get user authentication info
    const authHeader = req.headers.get('Authorization')
    const { userId, isApproved } = await getUserAuthInfo(supabase, authHeader);
    
    // Build and execute query
    console.log("Building query with:", { query, filterParams });
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
    console.error("Error in get-services function:", error);
    return handleApiError(error);
  }
});
