
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { transformTutorToService } from './tutorTransformer.ts';
import { buildTutorQuery } from './queryBuilder.ts';

// Check if any tutors exist and return an empty array if none are found
export async function checkForTutors(supabase: any) {
  console.log("Performing direct tutor count query without filters");
  const { data: tutorList, error: listError } = await supabase
    .from('tutors')
    .select('id, bio');
  
  console.log("Direct tutor list results:", {
    Count: tutorList?.length,
    Data: JSON.stringify(tutorList?.slice(0, 3)),
    Error: listError ? listError.message : "none"
  });
  
  return { tutorList, listError };
}

// Fetch tutors with search and filters
export async function fetchTutorsWithFilters(supabase: any, query: string, filterParams: any) {
  console.log("Building query with:", { query, filterParams });
  const queryBuilder = buildTutorQuery(supabase, query, filterParams);
  
  console.log("Executing query...");
  const { data: tutorsData, error } = await queryBuilder;
  
  console.log("Query execution result:");
  console.log("- Status:", error ? `Error: ${error.message}` : "200 OK");
  console.log("- Count:", tutorsData?.length || null);
  console.log("- Error:", error ? error.message : "none");
  console.log("- Data length:", tutorsData?.length);
  
  if (error) {
    throw new Error(`Error fetching tutors: ${error.message}`);
  }
  
  return tutorsData;
}

// Fetch schools information for tutors
export async function fetchSchoolsForTutors(supabase: any, tutorsData: any[]) {
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
  
  return schoolsMap;
}

// Transform tutors to services
export function transformTutorsToServices(tutorsData: any[], schoolsMap: any, userId: string | null, isApproved: boolean) {
  return tutorsData.map(tutor => {
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
}

// Log sample data for debugging
export function logSampleData(tutorsData: any[], services: any[]) {
  // Log sample tutor data to examine structure
  if (tutorsData.length > 0) {
    console.log("Sample tutor data (first record):", 
      JSON.stringify(tutorsData[0], null, 2)
    );
  }
  
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
}
