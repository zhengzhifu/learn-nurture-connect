import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ColumnDef } from '@tanstack/react-table';
import { Profile, School } from '@/types/auth';
import { fetchApprovedSchools } from '@/services/api/schoolService';

const Admin: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<Profile[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile && profile.user_type !== 'admin') {
      toast.error('You do not have permission to access this page');
      navigate('/');
    }
  }, [profile, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (usersError) throw usersError;
        setUsers(usersData || []);
        
        const schoolsData = await fetchApprovedSchools();
        setSchools(schoolsData || []);
      } catch (error: any) {
        console.error('Error fetching admin data:', error);
        toast.error(`Failed to load data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleApproveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ approval_status: 'approved' })
        .eq('id', userId);
        
      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, approval_status: 'approved' } : user
      ));
      
      toast.success('User approved successfully');
    } catch (error: any) {
      console.error('Error approving user:', error);
      toast.error(`Failed to approve user: ${error.message}`);
    }
  };
  
  const handleRejectUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ approval_status: 'rejected' })
        .eq('id', userId);
        
      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, approval_status: 'rejected' } : user
      ));
      
      toast.success('User rejected');
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      toast.error(`Failed to reject user: ${error.message}`);
    }
  };
  
  const handleApproveSchool = async (schoolId: string) => {
    try {
      const { error } = await supabase
        .from('schools')
        .update({ status: 'approved' })
        .eq('id', schoolId);
        
      if (error) throw error;
      
      setSchools(schools.map(school => 
        school.id === schoolId ? { ...school, status: 'approved' } : school
      ));
      
      toast.success('School approved successfully');
    } catch (error: any) {
      console.error('Error approving school:', error);
      toast.error(`Failed to approve school: ${error.message}`);
    }
  };
  
  const handleRejectSchool = async (schoolId: string) => {
    try {
      const { error } = await supabase
        .from('schools')
        .update({ status: 'rejected' })
        .eq('id', schoolId);
        
      if (error) throw error;
      
      setSchools(schools.map(school => 
        school.id === schoolId ? { ...school, status: 'rejected' } : school
      ));
      
      toast.success('School rejected');
    } catch (error: any) {
      console.error('Error rejecting school:', error);
      toast.error(`Failed to reject school: ${error.message}`);
    }
  };

  const userColumns: ColumnDef<Profile>[] = [
    {
      accessorKey: 'avatar_url',
      header: '',
      cell: ({ row }) => {
        const user = row.original;
        const initials = user.full_name
          ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
          : 'U';
          
        return (
          <Avatar>
            <AvatarImage src={user.avatar_url || ''} alt={user.full_name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: 'full_name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'user_type',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.original.user_type;
        return (
          <Badge variant={
            role === 'admin' ? 'destructive' : 
            role === 'tutor' ? 'default' : 
            'secondary'
          }>
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'approval_status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.approval_status;
        return (
          <Badge variant={
            status === 'approved' ? 'default' : 
            status === 'rejected' ? 'destructive' : 
            'outline'
          }>
            {status || 'pending'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original;
        const isPending = !user.approval_status || user.approval_status === 'pending';
        
        if (!isPending) return null;
        
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleApproveUser(user.id)}
            >
              Approve
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleRejectUser(user.id)}
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  const schoolColumns: ColumnDef<School>[] = [
    {
      accessorKey: 'name',
      header: 'School Name',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={
            status === 'approved' ? 'default' : 
            status === 'rejected' ? 'destructive' : 
            'outline'
          }>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return date.toLocaleDateString();
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const school = row.original;
        const isPending = school.status === 'pending';
        
        if (!isPending) return null;
        
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleApproveSchool(school.id)}
            >
              Approve
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleRejectSchool(school.id)}
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  const pendingUsers = users.filter(user => !user.approval_status || user.approval_status === 'pending');
  const pendingSchools = schools.filter(school => school.status === 'pending');

  return (
    <PageWrapper>
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          <Tabs defaultValue="pending">
            <TabsList className="mb-6">
              <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
              <TabsTrigger value="users">All Users</TabsTrigger>
              <TabsTrigger value="schools">All Schools</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending User Approvals</CardTitle>
                    <CardDescription>
                      {pendingUsers.length} users waiting for approval
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable 
                      columns={userColumns} 
                      data={pendingUsers} 
                      isLoading={isLoading}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Pending School Approvals</CardTitle>
                    <CardDescription>
                      {pendingSchools.length} schools waiting for approval
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable 
                      columns={schoolColumns} 
                      data={pendingSchools} 
                      isLoading={isLoading}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>
                    {users.length} users registered in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable 
                    columns={userColumns} 
                    data={users} 
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schools">
              <Card>
                <CardHeader>
                  <CardTitle>All Schools</CardTitle>
                  <CardDescription>
                    {schools.length} schools in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable 
                    columns={schoolColumns} 
                    data={schools} 
                    isLoading={isLoading}
                  />
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
