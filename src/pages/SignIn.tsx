
import React, { useEffect } from 'react';
import { GraduationCap, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/utils/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SignInForm from '@/components/auth/SignInForm';
import Button from '@/components/ui-custom/Button';
import { useAuth } from '@/hooks/auth/useAuth';
import { isTokenExpired } from '@/services/auth/sessionService';

const SignIn: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to dashboard if already authenticated AND token is valid
  useEffect(() => {
    // Prevent infinite redirects by only redirecting if we've completed loading
    if (isAuthenticated && !isLoading) {
      // Only redirect if token is valid
      if (!isTokenExpired()) {
        console.log('SignIn: User is authenticated with valid token, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        console.log('SignIn: Token is expired, staying on signin page');
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <PageWrapper>
      <div className="min-h-screen bg-mesh flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl mt-4">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm />
            <div className="mt-6 text-center">
              <Link to="/">
                <Button variant="outline" icon={<Home size={16} />}>
                  Return to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default SignIn;
