
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from './LoginForm';
import ForgotPasswordForm from './ForgotPasswordForm';

const SignInForm: React.FC = () => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const location = useLocation();
  
  // Get the return URL from location state, but don't set a default that could cause loops
  const from = (location.state as any)?.from || null;

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
