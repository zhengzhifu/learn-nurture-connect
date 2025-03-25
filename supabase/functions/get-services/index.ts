
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
    console.log("Edge function: get-services received request with method:", req.method)
    
    // Inspect headers
    console.log("Request headers:", JSON.stringify(Object.fromEntries([...req.headers.entries()]), null, 2))
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Perform a direct count query first
    console.log("Performing direct count query on tutors table")
    const { count: tutorCount, error: countError } = await supabase
      .from('tutors')
      .select('*', { count: 'exact', head: true })
    
    console.log("Direct count of tutors in database:", tutorCount, "Error:", countError ? JSON.stringify(countError) : "none")
    
    // Also try a simple select to see if we get any results
    console.log("Trying a simple select from tutors table")
    const { data: simpleTutors, error: simpleError } = await supabase
      .from('tutors')
      .select('*')
      .limit(5)
    
    console.log("Simple select results:", 
                simpleTutors ? `Found ${simpleTutors.length} tutors` : "No tutors found", 
                "Error:", simpleError ? JSON.stringify(simpleError) : "none")
    
    if (simpleTutors && simpleTutors.length > 0) {
      console.log("First tutor from simple query:", JSON.stringify(simpleTutors[0], null, 2))
    }
    
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
            try {
              const body = JSON.parse(text);
              console.log("Parsed body:", JSON.stringify(body, null, 2));
              query = body.query || '';
              filterParams = body.filters || {};
            } catch (e) {
              console.error("JSON parse error:", e.message);
              // Continue with empty parameters rather than failing
            }
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
    console.log("Auth header present:", !!authHeader);
    const { userId, isApproved } = await getUserAuthInfo(supabase, authHeader);
    
    // Build and execute query
    console.log("Building query with:", { query, filterParams });
    const queryBuilder = buildTutorQuery(supabase, query, filterParams);
    
    console.log("Executing query...");
    const { data: tutorsData, error } = await queryBuilder;
    
    if (error) {
      console.error("Database query error:", error);
      throw error;
    }
    
    console.log("Tutors data retrieved:", tutorsData ? tutorsData.length : 0);
    if (tutorsData && tutorsData.length === 0) {
      console.log("No tutors found from main query. Let's try a simpler approach");
      
      // Try a different query approach as a fallback
      console.log("Trying fallback query with explicit join");
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('tutors')
        .select(`
          *,
          profiles:profiles(*)
        `)
        .eq('profiles.approval_status', 'approved');
      
      console.log("Fallback query results:", 
                  fallbackData ? `Found ${fallbackData.length} tutors` : "No tutors found", 
                  "Error:", fallbackError ? JSON.stringify(fallbackError) : "none");
      
      if (fallbackData && fallbackData.length > 0) {
        console.log("Using fallback data instead");
        tutorsData = fallbackData;
      }
    } else if (tutorsData && tutorsData.length > 0) {
      console.log("First tutor data sample:", JSON.stringify(tutorsData[0], null, 2));
    }
    
    // Transform the data with access control based on authentication
    const services = tutorsData && tutorsData.length > 0 
      ? tutorsData.map(tutor => transformTutorToService(tutor, !!userId, isApproved))
      : [];
    
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
