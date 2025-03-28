
// Import the cors headers
import { corsHeaders } from './cors.ts';

// Main transformer function to convert tutor data to service format
export function transformTutorToService(tutor: any, isAuthenticated: boolean, isApproved: boolean) {
  const profile = tutor.profiles || {};
  
  // Debug log for image URL
  console.log("Transforming tutor to service:");
  console.log("- Tutor ID:", tutor.id);
  console.log("- Avatar URL:", profile.avatar_url || "NULL");
  console.log("- School:", profile.school ? profile.school.name : "NULL");
  console.log("- Access control:", { isAuthenticated, isApproved });
  
  // Format the name
  const firstName = profile.first_name || '';
  const lastName = profile.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();
  
  // Parse and extract formatted address if it's stored as JSON string
  let formattedAddress = 'Online';
  try {
    if (profile.home_address && typeof profile.home_address === 'string') {
      if (profile.home_address.includes('formatted_address')) {
        const addressObj = JSON.parse(profile.home_address);
        formattedAddress = addressObj.formatted_address || 'Online';
      } else {
        formattedAddress = profile.home_address;
      }
    }
  } catch (error) {
    console.error('Error parsing address JSON:', error);
    formattedAddress = profile.home_address || 'Online';
  }
  
  // Format specialties into subject strings
  const subjects = tutor.specialties && Array.isArray(tutor.specialties)
    ? tutor.specialties.map((s: any) => `${s.specialty_type}:${s.specialty_name}`)
    : [];
  
  // Format availability for display
  const availability = tutor.availability && Array.isArray(tutor.availability)
    ? tutor.availability.map((a: any) => {
        return `${a.day_of_week} ${a.start_time}-${a.end_time}`;
      })
    : [];
  
  // Basic service data that's available to everyone
  const serviceData: any = {
    id: tutor.id,
    title: `${fullName} - Tutoring Services`,
    description: tutor.bio || 'Professional tutoring services',
    type: 'tutoring',
    price: tutor.hourly_rate || 0,
    rating: 4.5, // Default rating since we don't have ratings yet
    location: formattedAddress,
    image: profile.avatar_url || null,
    availability: availability,
    subjects: subjects,
  };

  // Include school information if available
  if (profile.school) {
    serviceData.school = profile.school.name || null;
  }
  
  // Add provider information only if authenticated
  if (isAuthenticated) {
    serviceData.provider_id = tutor.id;
    serviceData.provider_name = fullName;
    serviceData.provider_avatar = profile.avatar_url || null;
    
    // Add contact information only if user is approved
    if (isApproved) {
      serviceData.contact_email = profile.email || null;
      serviceData.contact_phone = profile.phone || null;
    }
  }
  
  console.log("Transformed service data:", {
    id: serviceData.id,
    title: serviceData.title,
    school: serviceData.school || "NULL",
    image: serviceData.image || "NULL",
    location: serviceData.location,
  });
  
  return serviceData;
}
