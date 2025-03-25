
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import LoadingTimeout from '@/components/dashboard/LoadingTimeout';
import { isTokenExpired, refreshTokenIfNeeded } from '@/services/auth/sessionService';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showTimeout, setShowTimeout] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  
  // Force check if we have a valid auth token directly
  useEffect(() => {
    // Only perform check if we're not already on the signin page
    if (location.pathname === '/signin') {
      return;
    }
    
    const checkToken = async () => {
      // Prevent multiple redirects
      if (hasRedirected) return;
      
      // Try to refresh token if needed
      await refreshTokenIfNeeded();
      
      const isExpired = isTokenExpired();
      console.log('RequireAuth: Directly checking token, isExpired:', isExpired);
      
      // If token is expired or missing, redirect to signin
      if (isExpired) {
        console.log('RequireAuth: Token expired, redirecting to signin');
        setHasRedirected(true);
        toast.error('Your session has expired. Please sign in again.');
        navigate('/signin', { 
          state: { from: location.pathname },
          replace: true 
        });
        return false;
      }
      return true;
    };
    
    // Immediate check on mount
    checkToken();
    
    // Set up interval to periodically check token expiration
    const intervalId = setInterval(() => {
      checkToken();
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [navigate, location.pathname, hasRedirected]);
  
  // Set a timeout to show a friendly message if loading takes too long
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

  // Show toast if there are authentication errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      console.error('Auth error:', error);
    }
  }, [error]);

  // Check token using local storage first (fast path) when auth status changes
  useEffect(() => {
    // Skip checking if we're on the signin page or already redirected
    if (location.pathname === '/signin' || hasRedirected) {
      return;
    }
    
    if (!isLoading && !isAuthenticated) {
      const expired = isTokenExpired();
      
      if (expired) {
        console.log('RequireAuth: Not authenticated, redirecting to signin');
        setHasRedirected(true);
        toast.error('Authentication required. Please sign in.');
        navigate('/signin', { 
          state: { from: location.pathname },
          replace: true 
        });
      }
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname, hasRedirected]);

  // Show loading timeout UI if taking too long
  if (isLoading && showTimeout) {
    return <LoadingTimeout onRetry={() => window.location.reload()} message="This might be due to network issues or an expired session. You can try refreshing the page." />;
  }

  // Show standard loading UI
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <span className="text-lg mb-2">Verifying authentication...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center text-destructive">
        <AlertCircle className="h-12 w-12 mb-4" />
        <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
        <p className="text-center max-w-md mb-4">{error}</p>
        <div className="flex space-x-4">
          <button 
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md"
            onClick={() => navigate('/signin')}
          >
            Back to Login
          </button>
          <button 
            className="px-4 py-2 border border-destructive text-destructive rounded-md"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2 inline" /> Retry
          </button>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default RequireAuth;
