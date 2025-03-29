
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'
import { getUserAuthInfo } from '../_shared/auth.ts'
import { handleCorsPreflightRequest, parseRequestBody, createResponse, createErrorResponse } from '../_shared/requestHandler.ts'
import { checkForTutors, fetchTutorsWithFilters, fetchSchoolsForTutors, transformTutorsToServices, logSampleData } from '../_shared/serviceDataHelpers.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''

Deno.serve(async (req) => {
  // Handle CORS preflight request
  const preflightResponse = handleCorsPreflightRequest(req);
  if (preflightResponse) return preflightResponse;

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Parse request parameters
    const { query, filterParams } = await parseRequestBody(req);
    
    // Get user authentication info
    const authHeader = req.headers.get('Authorization')
    console.log("Auth header present:", !!authHeader);
    console.log("Auth header value (truncated):", authHeader ? `${authHeader.substring(0, 15)}...` : "none");
    
    const { userId, isApproved } = await getUserAuthInfo(supabase, authHeader);
    console.log("User authenticated:", !!userId);
    console.log("User approved:", isApproved);
    console.log("Authentication details:", { userId, isApproved });
    
    // Check if any tutors exist in the database
    const { tutorList, listError } = await checkForTutors(supabase);
    
    // If no tutors were found in direct query, return empty array immediately
    if (!tutorList || tutorList.length === 0) {
      return createResponse({ services: [] });
    }
    
    // Fetch tutors with filters
    const tutorsData = await fetchTutorsWithFilters(supabase, query, filterParams);
    
    // If no tutors were found, return empty array
    if (!tutorsData || tutorsData.length === 0) {
      return createResponse({ services: [] });
    }

    // Fetch schools information
    const schoolsMap = await fetchSchoolsForTutors(supabase, tutorsData);
    
    // Transform tutors to services
    const services = transformTutorsToServices(tutorsData, schoolsMap, userId, isApproved);
    
    // Log sample data
    logSampleData(tutorsData, services);
    
    return createResponse({ services });
    
  } catch (error) {
    return createErrorResponse(error);
  }
});
