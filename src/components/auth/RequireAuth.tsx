
import React from 'react';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  // Removed authentication checks to simplify the app
  return <>{children}</>;
};

export default RequireAuth;
