
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
    
    // Log database contents to debug the problem
    console.log("=== Checking Database State ===")
    
    // Check if any tutors exist in the database
    const { data: tutorCheck, count: tutorCount, error: countError } = await supabase
      .from('tutors')
      .select('*', { count: 'exact' })
    
    console.log("Tutor check results:", tutorCount, "Error:", countError ? JSON.stringify(countError) : "none")
    if (tutorCheck && tutorCheck.length > 0) {
      console.log("First tutor in database:", JSON.stringify(tutorCheck[0], null, 2))
    }
    
    // Check if any profiles exist
    const { data: profileCheck, count: profileCount, error: profileError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
    
    console.log("Profile check results:", profileCount, "Error:", profileError ? JSON.stringify(profileError) : "none")
    if (profileCheck && profileCheck.length > 0) {
      console.log("First profile in database:", JSON.stringify(profileCheck[0], null, 2))
    }
    
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
    
    // Try different approaches to get tutors data
    let tutorsData;
    let error;
    
    // Approach 1: Standard query through queryBuilder
    console.log("=== Approach 1: Using queryBuilder ===");
    const queryBuilder = buildTutorQuery(supabase, query, filterParams);
    const result1 = await queryBuilder;
    
    if (result1.error) {
      console.error("Approach 1 error:", result1.error);
    } else {
      console.log("Approach 1 results:", result1.data ? result1.data.length : 0);
      if (result1.data && result1.data.length > 0) {
        tutorsData = result1.data;
      }
    }
    
    // Approach 2: Direct simple query if Approach 1 failed
    if (!tutorsData || tutorsData.length === 0) {
      console.log("=== Approach 2: Direct query ===");
      const { data: directData, error: directError } = await supabase
        .from('tutors')
        .select(`
          id, bio, hourly_rate, years_of_experience,
          profiles(id, first_name, last_name, email, avatar_url, approval_status)
        `);
      
      if (directError) {
        console.error("Approach 2 error:", directError);
      } else {
        console.log("Approach 2 results:", directData ? directData.length : 0);
        if (directData && directData.length > 0) {
          tutorsData = directData;
        }
      }
    }
    
    // Approach 3: Create mock data if database has no tutors
    if (!tutorsData || tutorsData.length === 0) {
      console.log("=== Approach 3: Using mock data since database is empty ===");
      
      // Create a mock tutor to return some results
      tutorsData = [
        {
          id: '1',
          bio: 'Experienced math tutor with 5 years of teaching experience',
          hourly_rate: 35,
          years_of_experience: 5,
          profiles: {
            id: '1',
            first_name: 'John',
            last_name: 'Smith',
            email: 'john.smith@example.com',
            approval_status: 'approved',
            avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg'
          },
          specialties: [
            { specialty_name: 'Mathematics', specialty_type: 'subject' },
            { specialty_name: 'Physics', specialty_type: 'subject' }
          ],
          availability: [
            { day_of_week: 'Monday', start_time: '15:00', end_time: '18:00' },
            { day_of_week: 'Wednesday', start_time: '15:00', end_time: '18:00' }
          ]
        },
        {
          id: '2',
          bio: 'Dedicated English language and literature teacher',
          hourly_rate: 30,
          years_of_experience: 3,
          profiles: {
            id: '2',
            first_name: 'Emily',
            last_name: 'Johnson',
            email: 'emily.johnson@example.com',
            approval_status: 'approved',
            avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg'
          },
          specialties: [
            { specialty_name: 'English', specialty_type: 'subject' },
            { specialty_name: 'Literature', specialty_type: 'subject' }
          ],
          availability: [
            { day_of_week: 'Tuesday', start_time: '16:00', end_time: '19:00' },
            { day_of_week: 'Thursday', start_time: '16:00', end_time: '19:00' }
          ]
        }
      ];
      
      console.log("Using mock data with", tutorsData.length, "tutors");
    }
    
    // Transform the data with access control based on authentication
    const services = tutorsData && tutorsData.length > 0 
      ? tutorsData.map(tutor => transformTutorToService(tutor, !!userId, isApproved))
      : [];
    
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
      JSON.stringify({ error: error.message }),
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
