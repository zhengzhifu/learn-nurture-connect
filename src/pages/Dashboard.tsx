
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/utils/PageWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/auth/useAuth';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardError from '@/components/dashboard/DashboardError';
import LoadingTimeout from '@/components/dashboard/LoadingTimeout';
import { isTokenExpired, refreshTokenIfNeeded } from '@/services/auth/sessionService';

const Dashboard = () => {
  const { profile, user, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);

  // Set a timeout for the loading state
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowTimeout(true);
      }, 5000); // Show timeout message after 5 seconds
    } else {
      setShowTimeout(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);

  // Handle authentication
  useEffect(() => {
    if (hasRedirected) return;
    
    const checkAuth = async () => {
      if (!isLoading) {
        // Refresh token if needed
        await refreshTokenIfNeeded();
        
        const tokenExpired = isTokenExpired();
        
        if (!user || tokenExpired) {
          console.log('Dashboard: No valid user session, redirecting to signin');
          setHasRedirected(true);
          navigate('/signin', { replace: true });
        }
      }
    };
    
    checkAuth();
  }, [user, isLoading, navigate, hasRedirected]);

  const userData = profile ? {
    full_name: profile.full_name || 'User',
    user_type: profile.user_type || 'parent',
    avatar_url: profile.avatar_url
  } : (user ? {
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
    user_type: user.user_metadata?.role || 'parent',
    avatar_url: user.user_metadata?.avatar_url,
  } : null);

  // Show error state
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

  // Show timeout message
  if (isLoading && showTimeout) {
    return (
      <PageWrapper>
        <Navbar />
        <LoadingTimeout 
          onRetry={() => window.location.reload()}
          message="If this persists, your session might be invalid or there might be a problem with your profile data."
        />
        <Footer />
      </PageWrapper>
    );
  }

  // Don't render dashboard if not authenticated or data is still loading
  if (!isLoading && !userData) {
    return null;
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
