
// Authentication utility to get user information
export const getUserAuthInfo = async (supabase: any, authHeader: string | null) => {
  let userId = null;
  let isApproved = false;
  
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    console.log("Token length:", token ? token.length : 0);
    console.log("Token prefix (first 10 chars):", token ? token.substring(0, 10) + '...' : 'none');
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError) {
      console.error("Auth error:", authError.message);
      console.error("Auth error code:", authError.code);
      console.error("Auth error details:", JSON.stringify(authError, null, 2));
    }
    
    if (user) {
      userId = user.id;
      console.log("User authenticated with ID:", userId);
      console.log("User metadata:", JSON.stringify(user.user_metadata, null, 2));
      
      // Check if user is approved
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('approval_status, avatar_url')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
        console.error("Profile error code:", profileError.code);
        console.error("Profile error details:", JSON.stringify(profileError, null, 2));
      }
      
      if (profileData) {
        console.log("Profile data:", JSON.stringify(profileData, null, 2));
        isApproved = profileData?.approval_status === 'approved';
        console.log("Approval status from database:", profileData?.approval_status);
        console.log("Is user approved (boolean):", isApproved);
        
        // Check for avatar_url
        if (profileData.avatar_url) {
          console.log("Avatar URL found:", profileData.avatar_url);
        } else {
          console.log("No avatar URL found in profile");
        }
      } else {
        console.log("No profile data found for user ID:", userId);
      }
    } else {
      console.log("No user found from auth token");
    }
  } else {
    console.log("No auth header provided");
  }
  
  // Final result being returned
  console.log("Final auth result:", { userId, isApproved });
  return { userId, isApproved };
};
