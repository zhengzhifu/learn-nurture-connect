
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated, isLoading, error, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [manualAuthCheck, setManualAuthCheck] = useState(false);

  // Add additional debugging for authentication issues
  useEffect(() => {
    console.log('Auth status:', { isAuthenticated, isLoading, error, userId: user?.id });
  }, [isAuthenticated, isLoading, error, user]);

  useEffect(() => {
    // Show toast if there are authentication errors
    if (error) {
      toast.error(error);
      console.error('Auth error:', error);
    }
  }, [error]);

  // If loading persists too long, perform a manual check
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isLoading) {
      timer = setTimeout(() => {
        setManualAuthCheck(true);
        // Perform a direct session check
        supabase.auth.getSession().then(({ data, error }) => {
          console.log('Manual session check:', { 
            session: data.session ? 'exists' : 'null', 
            user: data.session?.user?.id, 
            error 
          });
          
          if (error) {
            toast.error(`Authentication error: ${error.message}`);
          } else if (data.session) {
            // If session exists but we're still loading, force a page reload
            window.location.reload();
          } else {
            // No session, redirect to signin
            navigate('/signin', { 
              state: { from: location.pathname },
              replace: true 
            });
          }
        });
      }, 5000); // Check after 5 seconds of loading
    }
    
    return () => clearTimeout(timer);
  }, [isLoading, navigate, location.pathname]);

  // If we're not loading and not authenticated, redirect to signin
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      // Redirect to sign in page with the return URL
      navigate('/signin', { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [isAuthenticated, isLoading, navigate, location, user]);

  // If still loading after 3 seconds, show a more informative message
  const [extendedLoading, setExtendedLoading] = useState(false);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => setExtendedLoading(true), 3000);
    } else {
      setExtendedLoading(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <span className="text-lg mb-2">Loading authentication data...</span>
        
        {(extendedLoading || manualAuthCheck) && (
          <div className="mt-4 max-w-md text-center">
            <p className="text-muted-foreground mb-4">
              {manualAuthCheck 
                ? "Authentication is taking longer than expected. Checking session status..."
                : "This is taking longer than expected. There might be an issue with the authentication service."}
            </p>
            <button 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}
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
            Return to Sign In
          </button>
          <button 
            className="px-4 py-2 border border-destructive text-destructive rounded-md"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Let the user proceed if authenticated, even if profile loading failed
  return isAuthenticated ? <>{children}</> : null;
};

export default RequireAuth;
