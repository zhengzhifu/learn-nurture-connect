
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminTabs from '@/components/admin/AdminTabs';
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

  return (
    <PageWrapper>
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          <AdminTabs 
            users={users}
            schools={schools}
            isLoading={isLoading}
            onApproveUser={handleApproveUser}
            onRejectUser={handleRejectUser}
            onApproveSchool={handleApproveSchool}
            onRejectSchool={handleRejectSchool}
          />
        </div>
      </div>
      
      <Footer />
    </PageWrapper>
  );
};

export default Admin;
