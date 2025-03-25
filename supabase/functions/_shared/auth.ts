
// Authentication utility to get user information
export const getUserAuthInfo = async (supabase: any, authHeader: string | null) => {
  let userId = null;
  let isApproved = false;
  
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (user) {
      userId = user.id;
      
      // Check if user is approved
      const { data: profileData } = await supabase
        .from('profiles')
        .select('approval_status')
        .eq('id', userId)
        .single();
        
      isApproved = profileData?.approval_status === 'approved';
    }
  }
  
  console.log("User authenticated:", !!userId);
  console.log("User approved:", isApproved);
  
  return { userId, isApproved };
};
