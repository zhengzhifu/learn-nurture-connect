
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: Array<'parent' | 'tutor'>;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // If still loading, show nothing (or a spinner in a real app)
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If not authenticated, redirect to sign in page
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If roles are specified and user doesn't have the right role
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and has the right role, render children
  return <>{children}</>;
};

export default RequireAuth;
