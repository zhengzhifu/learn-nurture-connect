// This file is a placeholder as MyTutors is not part of the MVP scope
// We're keeping a minimal stub to avoid build errors

import React from 'react';
import { Navigate } from 'react-router-dom';

const MyTutorsPage: React.FC = () => {
  // Redirect to home page since this feature is not in MVP scope
  return <Navigate to="/" replace />;
};

export default MyTutorsPage;
