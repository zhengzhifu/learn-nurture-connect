
// Authentication utility to get user information
export const getUserAuthInfo = async (supabase: any, authHeader: string | null) => {
  let userId = null;
  let isApproved = false;
  
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError) {
      console.error("Auth error:", authError.message);
    }
    
    if (user) {
      userId = user.id;
      console.log("User authenticated with ID:", userId);
      
      // Check if user is approved
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('approval_status, avatar_url')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
      }
      
      if (profileData) {
        console.log("Profile data:", JSON.stringify(profileData, null, 2));
        isApproved = profileData?.approval_status === 'approved';
      }
    }
  }
  
  return { userId, isApproved };
};
