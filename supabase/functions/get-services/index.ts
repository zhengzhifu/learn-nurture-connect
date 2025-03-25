
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
    
    // Check if any tutors exist in the database - explicit count
    console.log("Performing direct count query on tutors table");
    const { count: tutorCount, error: countError } = await supabase
      .from('tutors')
      .select('*', { count: 'exact', head: true });
    
    console.log("Direct count of tutors in database:", tutorCount, "Error:", countError ? JSON.stringify(countError) : "none");
    
    // Try a simple select to confirm we can read the table
    console.log("Trying a simple select from tutors table");
    const { data: simpleTutors, error: simpleError } = await supabase
      .from('tutors')
      .select('id');
    
    console.log("Simple select results:", "Found", simpleTutors?.length || 0, "tutors", "Error:", simpleError ? JSON.stringify(simpleError) : "none");

    // Fetch specific tutor to verify it exists
    console.log("Checking for specific tutor with ID 842a450a-eca3-4e23-a02e-b2f93706d208");
    const { data: specificTutor, error: specificError } = await supabase
      .from('tutors')
      .select('id, bio')
      .eq('id', '842a450a-eca3-4e23-a02e-b2f93706d208');
    
    console.log("Specific tutor query results:", 
      "Found:", specificTutor?.length > 0 ? "Yes" : "No", 
      "Data:", JSON.stringify(specificTutor || []), 
      "Error:", specificError ? JSON.stringify(specificError) : "none"
    );
    
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
      
      // Try a fallback query with explicit joins
      console.log("Trying fallback query with explicit join");
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('tutors')
        .select('id, bio, hourly_rate, years_of_experience')
        .limit(10);
      
      console.log("Fallback query results:", "Found", fallbackData?.length || 0, "tutors", "Error:", fallbackError ? JSON.stringify(fallbackError) : "none");
      
      // Return an empty array
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
