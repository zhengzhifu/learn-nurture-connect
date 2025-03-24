
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import LoadingTimeout from '@/components/dashboard/LoadingTimeout';
import { isTokenExpired } from '@/services/auth/sessionService';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showTimeout, setShowTimeout] = useState(false);
  const [checkingToken, setCheckingToken] = useState(false);
  
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

  // Check if token is explicitly expired
  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (!isLoading && !isAuthenticated) {
        setCheckingToken(true);
        try {
          const expired = await isTokenExpired();
          if (expired) {
            console.log('Token is expired, redirecting to signin');
            toast.error('Your session has expired. Please sign in again.');
            navigate('/signin', { 
              state: { from: location.pathname },
              replace: true 
            });
          }
        } catch (error) {
          console.error('Error checking token expiration:', error);
        } finally {
          setCheckingToken(false);
        }
      }
    };
    
    checkTokenExpiration();
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  // If not loading but not authenticated, redirect to signin
  useEffect(() => {
    if (!isLoading && !checkingToken && !isAuthenticated) {
      console.log('Not authenticated, redirecting to signin');
      navigate('/signin', { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [isAuthenticated, isLoading, checkingToken, navigate, location.pathname]);

  // Show loading timeout UI if taking too long
  if ((isLoading || checkingToken) && showTimeout) {
    return (
      <LoadingTimeout 
        onRetry={() => window.location.reload()} 
        message="This might be due to network issues or an expired session. You can try refreshing the page."
      />
    );
  }

  // Show standard loading UI
  if (isLoading || checkingToken) {
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

  // Let the user proceed if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default RequireAuth;
