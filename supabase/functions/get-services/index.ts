
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'
import { transformTutorToService } from '../_shared/tutorTransformer.ts'
import { buildTutorQuery } from '../_shared/queryBuilder.ts'
import { getUserAuthInfo } from '../_shared/auth.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''

Deno.serve(async (req) => {
  // Handle CORS - this is critical for preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200
    })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Parse request body for parameters
    let query = '';
    let filterParams = {};
    
    if (req.method === 'POST') {
      try {
        const contentType = req.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const clonedReq = req.clone();
          const text = await clonedReq.text();
          
          if (text && text.trim() !== '') {
            try {
              const body = JSON.parse(text);
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
    console.log("Auth header value (truncated):", authHeader ? `${authHeader.substring(0, 15)}...` : "none");
    
    const { userId, isApproved } = await getUserAuthInfo(supabase, authHeader);
    console.log("User authenticated:", !!userId);
    console.log("User approved:", isApproved);
    console.log("Authentication details:", { userId, isApproved });
    
    // Check if any tutors exist in the database
    console.log("Performing direct tutor count query without filters");
    const { data: tutorList, error: listError } = await supabase
      .from('tutors')
      .select('id, bio');
    
    console.log("Direct tutor list results:", {
      Count: tutorList?.length,
      Data: JSON.stringify(tutorList?.slice(0, 3)),
      Error: listError ? listError.message : "none"
    });
    
    // If no tutors were found in direct query, return empty array immediately
    if (!tutorList || tutorList.length === 0) {
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
    
    console.log("Executing query...");
    // Execute query
    const { data: tutorsData, error } = await queryBuilder;
    
    console.log("Query execution result:");
    console.log("- Status:", error ? `Error: ${error.message}` : "200 OK");
    console.log("- Count:", tutorsData?.length || null);
    console.log("- Error:", error ? error.message : "none");
    console.log("- Data length:", tutorsData?.length);
    
    if (error) {
      throw new Error(`Error fetching tutors: ${error.message}`);
    }
    
    // If no tutors were found, return empty array
    if (!tutorsData || tutorsData.length === 0) {
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

    // Log sample tutor data to examine structure
    if (tutorsData.length > 0) {
      console.log("Sample tutor data (first record):", 
        JSON.stringify(tutorsData[0], null, 2)
      );
    }
    
    // Fetch schools information separately to avoid the relationship error
    console.log("Fetching schools information separately");
    const schoolIds = tutorsData
      .map(tutor => tutor.profiles.school_id)
      .filter(id => id !== null && id !== undefined);
    
    console.log("School IDs to fetch:", schoolIds);
    
    let schoolsMap = {};
    if (schoolIds.length > 0) {
      const { data: schools, error: schoolError } = await supabase
        .from('schools')
        .select('id, name, address')
        .in('id', schoolIds);
        
      console.log("Schools query result:", {
        Count: schools?.length || 0,
        Error: schoolError ? schoolError.message : "none"
      });
      
      if (schools && schools.length > 0) {
        // Create a map of school ID to school data for quick lookups
        schoolsMap = schools.reduce((map, school) => {
          map[school.id] = school;
          return map;
        }, {});
        
        console.log("Schools map created with keys:", Object.keys(schoolsMap));
      }
    }
    
    // Transform the data with access control based on authentication
    const services = tutorsData.map(tutor => {
      // Add school information to the tutor object
      const schoolId = tutor.profiles.school_id;
      const schoolData = schoolId && schoolsMap[schoolId] ? schoolsMap[schoolId] : null;
      
      const tutorWithSchool = {
        ...tutor,
        profiles: {
          ...tutor.profiles,
          school: schoolData
        }
      };
      
      return transformTutorToService(tutorWithSchool, !!userId, isApproved);
    });
    
    // Log sample service after transformation
    if (services.length > 0) {
      console.log("Sample transformed service (first record):", 
        JSON.stringify(services[0], null, 2)
      );
      
      // Log specific info about image URLs and schools
      services.forEach((service, i) => {
        console.log(`Service ${i+1} (ID: ${service.id}) Image URL:`, service.image || "NULL");
        console.log(`Service ${i+1} (ID: ${service.id}) School:`, service.school || "NULL");
      });
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
