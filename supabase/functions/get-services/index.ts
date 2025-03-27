
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'
import { transformTutorToService } from '../_shared/tutorTransformer.ts'
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
    
    // DIAGNOSTIC: Check database connection and configuration
    console.log("Supabase URL:", supabaseUrl)
    console.log("Connected with anon key (first 10 chars):", supabaseAnonKey.substring(0, 10) + "...")
    
    // Check if any tutors exist in the database - with more detailed diagnostics
    console.log("Performing direct tutor count query without filters");
    const { data: tutorList, error: listError } = await supabase
      .from('tutors')
      .select('id, bio')
      .limit(10);
    
    console.log("Direct tutor list results:", 
      "Count:", tutorList?.length || 0, 
      "Data:", JSON.stringify(tutorList || []), 
      "Error:", listError ? JSON.stringify(listError) : "none");
    
    // Parse request body for parameters
    let query = '';
    let filterParams = {};
    
    if (req.method === 'POST') {
      try {
        const contentType = req.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
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
            }
          }
        }
      } catch (e) {
        console.error('Error parsing request body:', e);
      }
    }
    
    // Get user authentication info
    const authHeader = req.headers.get('Authorization')
    console.log("Auth header present:", !!authHeader);
    const { userId, isApproved } = await getUserAuthInfo(supabase, authHeader);
    console.log("Authentication details:", { userId, isApproved });
    
    // If no tutors were found in direct query, return empty array immediately
    if (!tutorList || tutorList.length === 0) {
      console.log("No tutors found in direct database query. Returning empty array.");
      
      return new Response(
        JSON.stringify({ services: [] }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 200,
        }
      );
    }
    
    // Build query with search and filters
    console.log("Building query with:", { query, filterParams });
    const queryBuilder = buildTutorQuery(supabase, query, filterParams);
    
    // Execute query
    console.log("Executing query...");
    const { data: tutorsData, error, status, statusText, count } = await queryBuilder;
    
    console.log("Query execution result:");
    console.log("- Status:", status, statusText);
    console.log("- Count:", count);
    console.log("- Error:", error ? JSON.stringify(error) : "none");
    console.log("- Data length:", tutorsData?.length || 0);
    
    if (error) {
      console.error("Query error:", error);
      throw new Error(`Error fetching tutors: ${error.message}`);
    }
    
    // If no tutors were found, return empty array
    if (!tutorsData || tutorsData.length === 0) {
      console.log("No tutors found from query.");
      return new Response(
        JSON.stringify({ services: [] }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 200,
        }
      );
    }
    
    // Transform the data with access control based on authentication
    const services = tutorsData.map(tutor => 
      transformTutorToService(tutor, !!userId, isApproved)
    );
    
    console.log("Transformed services:", services.length);
    if (services.length > 0) {
      console.log("First service sample:", JSON.stringify(services[0], null, 2));
    }
    
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
    return new Response(
      JSON.stringify({ error: error.message, services: [] }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
});
