
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Profile, School } from '@/types/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Button from '@/components/ui-custom/Button';
import { CheckCircle, XCircle, User, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const { profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [pendingProfiles, setPendingProfiles] = useState<Profile[]>([]);
  const [pendingSchools, setPendingSchools] = useState<School[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    // Redirect if not admin
    if (!isLoading && (!profile || profile.user_type !== 'admin')) {
      toast.error('You do not have permission to access this page');
      navigate('/');
    } else if (profile?.user_type === 'admin') {
      fetchPendingData();
    }
  }, [profile, isLoading, navigate]);

  const fetchPendingData = async () => {
    setIsLoadingData(true);
    try {
      // Fetch pending profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('approval_status', 'pending');
        
      if (profilesError) {
        throw profilesError;
      }
      
      setPendingProfiles(profilesData as Profile[]);
      
      // Fetch pending schools
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('*')
        .eq('status', 'pending');
        
      if (schoolsError) {
        throw schoolsError;
      }
      
      setPendingSchools(schoolsData as School[]);
    } catch (error) {
      console.error('Error fetching pending data:', error);
      toast.error('Failed to fetch pending approvals');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleProfileApproval = async (profileId: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          approval_status: approved ? 'approved' : 'rejected' 
        })
        .eq('id', profileId);
        
      if (error) {
        throw error;
      }
      
      setPendingProfiles(pendingProfiles.filter(p => p.id !== profileId));
      toast.success(`Profile ${approved ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating profile status:', error);
      toast.error('Failed to update profile status');
    }
  };

  const handleSchoolApproval = async (schoolId: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('schools')
        .update({ 
          status: approved ? 'approved' : 'rejected' 
        })
        .eq('id', schoolId);
        
      if (error) {
        throw error;
      }
      
      setPendingSchools(pendingSchools.filter(s => s.id !== schoolId));
      toast.success(`School ${approved ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating school status:', error);
      toast.error('Failed to update school status');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading || !profile || profile.user_type !== 'admin') {
    return (
      <PageWrapper>
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Administrator Dashboard</h1>
          
          <Tabs defaultValue="profiles" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="profiles" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Pending Profiles</span>
                {pendingProfiles.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {pendingProfiles.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="schools" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>Pending Schools</span>
                {pendingSchools.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {pendingSchools.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profiles">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Profile Approvals</CardTitle>
                  <CardDescription>
                    Review and approve user profiles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingData ? (
                    <p className="text-center py-8">Loading pending profiles...</p>
                  ) : pendingProfiles.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      No pending profiles to approve
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {pendingProfiles.map(profile => (
                        <div key={profile.id} className="p-6 border rounded-lg shadow-sm flex flex-col md:flex-row md:items-start gap-6">
                          <Avatar className="h-16 w-16 mx-auto md:mx-0">
                            <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name} />
                            <AvatarFallback className="text-lg">{getInitials(profile.full_name)}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold">{profile.full_name}</h3>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <Badge variant="outline">
                                  {profile.user_type?.charAt(0).toUpperCase() + (profile.user_type?.slice(1) || '')}
                                </Badge>
                                <Badge variant="outline">{profile.email}</Badge>
                                {profile.phone && <Badge variant="outline">{profile.phone}</Badge>}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium">Home Address:</p>
                                <p className="text-muted-foreground">{profile.home_address || 'Not provided'}</p>
                              </div>
                              
                              <div>
                                <p className="font-medium">School:</p>
                                <p className="text-muted-foreground">
                                  {profile.school_name || profile.other_school_name || 'Not provided'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
                            <Button 
                              onClick={() => handleProfileApproval(profile.id, true)} 
                              variant="default"
                              className="flex-1 md:w-full"
                              size="sm"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button 
                              onClick={() => handleProfileApproval(profile.id, false)} 
                              variant="secondary"
                              className="flex-1 md:w-full"
                              size="sm"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schools">
              <Card>
                <CardHeader>
                  <CardTitle>Pending School Approvals</CardTitle>
                  <CardDescription>
                    Review and approve school submissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingData ? (
                    <p className="text-center py-8">Loading pending schools...</p>
                  ) : pendingSchools.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      No pending schools to approve
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {pendingSchools.map(school => (
                        <div key={school.id} className="p-6 border rounded-lg shadow-sm flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">{school.name}</h3>
                            <p className="text-muted-foreground">
                              {school.address || 'No address provided'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Submitted: {new Date(school.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
                            <Button 
                              onClick={() => handleSchoolApproval(school.id, true)} 
                              variant="default"
                              size="sm"
                              className="flex-1 md:w-full"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button 
                              onClick={() => handleSchoolApproval(school.id, false)} 
                              variant="secondary"
                              size="sm"
                              className="flex-1 md:w-full"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </PageWrapper>
  );
};

export default Admin;
