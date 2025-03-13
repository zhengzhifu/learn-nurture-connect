
import React from 'react';
import { GraduationCap } from 'lucide-react';
import PageWrapper from '@/components/utils/PageWrapper';
import SignInForm from '@/components/auth/SignInForm';

const SignIn: React.FC = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-mesh flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="glass-card w-full max-w-md space-y-8 p-8 rounded-xl">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>
          
          <SignInForm />
        </div>
      </div>
    </PageWrapper>
  );
};

export default SignIn;
