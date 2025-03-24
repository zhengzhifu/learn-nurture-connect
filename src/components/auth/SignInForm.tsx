
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import LoginForm from './LoginForm';
import ForgotPasswordForm from './ForgotPasswordForm';

const SignInForm: React.FC = () => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const location = useLocation();
  
  // Get the return URL from location state
  const from = (location.state as any)?.from || '/dashboard';

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
  };

  return isForgotPassword ? (
    <ForgotPasswordForm onBackToSignIn={toggleForgotPassword} />
  ) : (
    <LoginForm onForgotPassword={toggleForgotPassword} />
  );
};

export default SignInForm;
