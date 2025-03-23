
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BadgeCheck,
  XCircle,
  Clock,
  GraduationCap,
  User,
  School as SchoolIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Button from '@/components/ui-custom/Button';
import { Profile, School, ApprovalStatus } from '@/types/auth';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("tutors");
  const [pendingTutors, setPendingTutors] = useState<Profile[]>([]);
  const [pendingSchools, setPendingSchools] = useState<School[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && profile?.user_type !== 'admin') {
      toast.error('You do not have access to this page');
      navigate('/dashboard');
    }
  }, [isLoading, profile, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (profile?.user_type !== 'admin') return;
      
      setIsDataLoading(true);
      setError(null);
      
      try {
        // Fetch tutors pending approval
        const { data: tutorsData, error: tutorsError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_type', 'tutor')
          .eq('approval_status', 'pending');
          
        if (tutorsError) throw tutorsError;
        setPendingTutors(tutorsData as Profile[]);
        
        // Fetch schools pending approval
        const { data: schoolsData, error: schoolsError } = await supabase
          .from('schools')
          .select('*')
          .eq('status', 'pending');
          
        if (schoolsError) throw schoolsError;
        setPendingSchools(schoolsData as School[]);
        
      } catch (err: any) {
        console.error('Error fetching admin data:', err);
        setError(err.message);
        toast.error(`Failed to load data: ${err.message}`);
      } finally {
        setIsDataLoading(false);
      }
    };
    
    fetchData();
  }, [profile]);

  const handleApproveTutor = async (tutorId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ approval_status: 'approved' })
        .eq('id', tutorId);
        
      if (error) throw error;
      
      setPendingTutors(prev => prev.filter(tutor => tutor.id !== tutorId));
      toast.success('Tutor approved successfully');
    } catch (err: any) {
      console.error('Error approving tutor:', err);
      toast.error(`Failed to approve tutor: ${err.message}`);
    }
  };

  const handleRejectTutor = async (tutorId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ approval_status: 'rejected' })
        .eq('id', tutorId);
        
      if (error) throw error;
      
      setPendingTutors(prev => prev.filter(tutor => tutor.id !== tutorId));
      toast.success('Tutor rejected');
    } catch (err: any) {
      console.error('Error rejecting tutor:', err);
      toast.error(`Failed to reject tutor: ${err.message}`);
    }
  };

  const handleApproveSchool = async (schoolId: string) => {
    try {
      const { error } = await supabase
        .from('schools')
        .update({ status: 'approved' })
        .eq('id', schoolId);
        
      if (error) throw error;
      
      setPendingSchools(prev => prev.filter(school => school.id !== schoolId));
      toast.success('School approved successfully');
    } catch (err: any) {
      console.error('Error approving school:', err);
      toast.error(`Failed to approve school: ${err.message}`);
    }
  };

  const handleRejectSchool = async (schoolId: string) => {
    try {
      const { error } = await supabase
        .from('schools')
        .update({ status: 'rejected' })
        .eq('id', schoolId);
        
      if (error) throw error;
      
      setPendingSchools(prev => prev.filter(school => school.id !== schoolId));
      toast.success('School rejected');
    } catch (err: any) {
      console.error('Error rejecting school:', err);
      toast.error(`Failed to reject school: ${err.message}`);
    }
  };
  
  const getSchoolNameById = async (schoolId: string | undefined) => {
    if (!schoolId) return 'No school selected';
    
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('name')
        .eq('id', schoolId)
        .single();
        
      if (error) throw error;
      return data.name;
    } catch (err) {
      console.error('Error fetching school name:', err);
      return 'Unknown school';
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-center">
              <h2 className="text-2xl font-bold">Loading admin panel...</h2>
            </div>
          </div>
        </div>
        <Footer />
      </PageWrapper>
    );
  }

  if (profile?.user_type !== 'admin') {
    return null; // Navigate handled in useEffect
  }

  return (
    <PageWrapper>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">Admin Panel</CardTitle>
            <CardDescription>
              Manage tutor approvals, school registrations, and other administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-none mb-6">
                <TabsTrigger value="tutors" className="flex gap-2 items-center">
                  <User size={16} />
                  <span>Pending Tutors</span>
                  {pendingTutors.length > 0 && (
                    <Badge variant="secondary">{pendingTutors.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="schools" className="flex gap-2 items-center">
                  <SchoolIcon size={16} />
                  <span>Pending Schools</span>
                  {pendingSchools.length > 0 && (
                    <Badge variant="secondary">{pendingSchools.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tutors">
                {isDataLoading ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto mb-4 animate-spin text-muted-foreground" />
                    <p>Loading tutors...</p>
                  </div>
                ) : pendingTutors.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg">
                    <BadgeCheck className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <h3 className="text-xl font-medium mb-2">All caught up!</h3>
                    <p className="text-muted-foreground">There are no tutors waiting for approval.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tutor</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>School</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingTutors.map((tutor) => (
                          <TableRow key={tutor.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={tutor.avatar_url || ''} alt={tutor.full_name} />
                                  <AvatarFallback>{tutor.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{tutor.full_name}</div>
                                  <div className="text-sm text-muted-foreground">{tutor.phone}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{tutor.email}</TableCell>
                            <TableCell>
                              {tutor.school_id ? (
                                <div className="flex items-center gap-1">
                                  <GraduationCap className="h-4 w-4" />
                                  <span>{tutor.other_school_name || getSchoolNameById(tutor.school_id)}</span>
                                </div>
                              ) : tutor.other_school_name ? (
                                <div>
                                  <span>{tutor.other_school_name}</span>
                                  <Badge variant="outline" className="ml-2">New</Badge>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">No school selected</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleApproveTutor(tutor.id)}
                                  className="w-24"
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleRejectTutor(tutor.id)}
                                  className="w-24"
                                >
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="schools">
                {isDataLoading ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto mb-4 animate-spin text-muted-foreground" />
                    <p>Loading schools...</p>
                  </div>
                ) : pendingSchools.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg">
                    <BadgeCheck className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <h3 className="text-xl font-medium mb-2">All caught up!</h3>
                    <p className="text-muted-foreground">There are no schools waiting for approval.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>School Name</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Date Submitted</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingSchools.map((school) => (
                          <TableRow key={school.id}>
                            <TableCell>
                              <div className="font-medium">{school.name}</div>
                            </TableCell>
                            <TableCell>{school.address || 'No address provided'}</TableCell>
                            <TableCell>{new Date(school.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleApproveSchool(school.id)}
                                  className="w-24"
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleRejectSchool(school.id)}
                                  className="w-24"
                                >
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </PageWrapper>
  );
};

export default Admin;
