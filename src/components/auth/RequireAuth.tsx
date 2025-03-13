
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Show toast if there are authentication errors
    if (error) {
      toast.error(error);
      console.error('Auth error:', error);
    }
  }, [error]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to sign in page with the return URL
      navigate('/signin', { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center text-destructive">
        <AlertCircle className="h-12 w-12 mb-4" />
        <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
        <p className="text-center max-w-md mb-4">{error}</p>
        <button 
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md"
          onClick={() => navigate('/signin')}
        >
          Return to Sign In
        </button>
      </div>
    );
  }

  // If the user is authenticated, render the children
  return isAuthenticated ? <>{children}</> : null;
};

export default RequireAuth;
