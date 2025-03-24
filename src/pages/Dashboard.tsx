
import React from 'react';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardError from '@/components/dashboard/DashboardError';

const Dashboard = () => {
  const { profile, user, isLoading, error } = useAuth();

  // Create a safe user data object to prevent any circular references
  const userData = profile ? {
    full_name: profile.full_name || 'User',
    user_type: profile.user_type || 'parent',
    avatar_url: profile.avatar_url
  } : (user ? {
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
    user_type: user.user_metadata?.role || 'parent',
    avatar_url: user.user_metadata?.avatar_url,
  } : null);

  if (error) {
    return (
      <PageWrapper>
        <Navbar />
        <DashboardError 
          error={error} 
          onRetry={() => window.location.reload()} 
        />
        <Footer />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar userData={userData} isLoading={isLoading} />
          
          <div className="lg:w-3/4 space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {isLoading ? (
                  <span className="inline-block h-4 w-24 bg-gray-200 animate-pulse rounded"></span>
                ) : (
                  userData?.full_name?.split(' ')[0] || "User"
                )}. Here's an overview of your TutorFind account.
              </p>
            </div>
            
            <DashboardStats />
            
            <div className="bg-muted/40 rounded-lg p-6 text-center">
              <h3 className="text-xl font-medium mb-2">MVP Version Notice</h3>
              <p className="text-muted-foreground">
                This is the MVP version of TutorFind. Session management features will be available in future updates.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </PageWrapper>
  );
};

export default Dashboard;
