
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

  // Perform an immediate direct session check
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log('Direct session check in RequireAuth:', { 
          hasSession: !!data.session,
          userId: data.session?.user?.id
        });
        
        // If we have a direct session but isAuthenticated is false and not loading
        if (data.session && !isAuthenticated && !isLoading) {
          console.log('Session exists but not authenticated in context, force reload');
          window.location.reload();
          return;
        }
        
        // If no session and not on auth page, redirect to signin
        if (!data.session && !isLoading && !isAuthenticated) {
          console.log('No session found, redirecting to signin');
          navigate('/signin', { 
            state: { from: location.pathname },
            replace: true 
          });
          return;
        }
        
        setCheckingAuth(false);
      } catch (err) {
        console.error('Session check error:', err);
        setCheckingAuth(false);
      }
    };
    
    if (!isLoading) {
      checkSession();
    }
    
    // Safeguard against infinite loading
    const timer = setTimeout(() => {
      if (checkingAuth) {
        console.log('Force clearing checking auth state after timeout');
        setCheckingAuth(false);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
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

  // Safeguard against infinite loading - force render after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading || checkingAuth) {
        console.log('Forcing component to continue after timeout');
        // Don't set state variables, just let the component render
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isLoading, checkingAuth]);

  if (isLoading || checkingAuth) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <span className="text-lg mb-2">Loading...</span>
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

  // Let the user proceed if authenticated, even if profile loading failed
  return isAuthenticated ? <>{children}</> : null;
};

export default RequireAuth;
