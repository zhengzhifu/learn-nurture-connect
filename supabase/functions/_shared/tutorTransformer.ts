
import { corsHeaders } from './cors.ts';

// Transform tutor data into service format with access control
export const transformTutorToService = (tutor: any, isAuthenticated: boolean, isApproved: boolean) => {
  // Extra logging to understand data transformation
  console.log("Transforming tutor data:", JSON.stringify(tutor, null, 2));
  
  // Extract profile data
  const profile = tutor.profiles || {};
  
  // Handle availability
  const availability = tutor.availability 
    ? tutor.availability.map((a: any) => `${a.day_of_week} ${a.start_time}-${a.end_time}`)
    : ['Flexible'];
  
  // Handle specialties
  const subjects = tutor.specialties 
    ? tutor.specialties.map((s: any) => s.specialty_name)
    : ['General'];
  
  // Base service object
  const service = {
    id: tutor.id,
    title: `Tutoring Services`,
    description: tutor.bio || 'Professional tutoring services',
    type: 'tutoring',
    price: tutor.hourly_rate || 35,
    rating: 4.5, // Default rating
    location: 'Online', // Default location
    image: null,
    availability: availability,
    subjects: subjects,
  };
  
  // Add fields based on authentication and approval status
  if (isAuthenticated) {
    // Authenticated users can see first name and partial details
    service.provider_name = profile.first_name;
    service.image = profile.avatar_url;
    
    if (isApproved) {
      // Approved users see most details
      service.provider_name = `${profile.first_name} ${profile.last_name.charAt(0)}.`;
      service.provider_id = profile.id;
      service.provider_avatar = profile.avatar_url;
      service.contact_email = profile.email;
      service.contact_phone = profile.phone;
      
      // Full address not shown for privacy reasons
      if (profile.home_address) {
        try {
          // Try to parse the JSON string if it's stored that way
          let addressObj = profile.home_address;
          if (typeof profile.home_address === 'string') {
            try {
              addressObj = JSON.parse(profile.home_address);
              if (addressObj.city && addressObj.state) {
                service.location = `${addressObj.city}, ${addressObj.state}`;
              } else if (addressObj.formatted_address) {
                const parts = addressObj.formatted_address.split(',');
                if (parts.length > 1) {
                  service.location = parts.slice(1).join(',').trim();
                }
              }
            } catch (e) {
              // If not valid JSON, use the string directly
              const addressParts = profile.home_address.split(',');
              if (addressParts.length > 1) {
                service.location = addressParts[addressParts.length - 2].trim() + ', ' + 
                               addressParts[addressParts.length - 1].trim();
              }
            }
          }
        } catch (e) {
          console.error("Error parsing address:", e);
          service.location = 'Location available upon request';
        }
      }
    }
  }
  
  console.log("Transformed service data:", JSON.stringify(service, null, 2));
  return service;
};

// Helper function to handle errors in the API
export const handleApiError = (error: Error) => {
  console.error('Error:', error);
  
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
};
