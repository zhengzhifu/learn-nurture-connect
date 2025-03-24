
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import LoginForm from './LoginForm';
import ForgotPasswordForm from './ForgotPasswordForm';

const SignInForm: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the return URL from location state
  const from = (location.state as any)?.from || '/dashboard';
  
  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
