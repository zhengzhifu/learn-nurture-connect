
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
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Perform a direct session check on mount and when auth state changes
  useEffect(() => {
    const checkSession = async () => {
      try {
        setCheckingAuth(true);
        
        // Get the current session directly from Supabase
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session check error:', sessionError);
          setCheckingAuth(false);
          return;
        }
        
        console.log('Direct session check in RequireAuth:', { 
          hasSession: !!data.session,
          userId: data.session?.user?.id,
          authenticated: isAuthenticated
        });
        
        // If no session found, redirect to signin
        if (!data.session) {
          console.log('No session found, redirecting to signin');
          navigate('/signin', { 
            state: { from: location.pathname },
            replace: true 
          });
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setCheckingAuth(false);
      }
    };
    
    if (!isLoading) {
      checkSession();
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  // Show toast if there are authentication errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      console.error('Auth error:', error);
    }
  }, [error]);

  // If not loading but not authenticated, redirect to signin
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !checkingAuth) {
      console.log('Not authenticated, redirecting to signin');
      navigate('/signin', { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname, checkingAuth]);

  // Only using a brief timeout as a last resort
  useEffect(() => {
    const timer = setTimeout(() => {
      if (checkingAuth) {
        console.log('Forcing auth check to complete after timeout');
        setCheckingAuth(false);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [checkingAuth]);

  if (isLoading || checkingAuth) {
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
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Let the user proceed if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default RequireAuth;
