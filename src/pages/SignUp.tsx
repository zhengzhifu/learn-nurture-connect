
import React from 'react';
import { GraduationCap, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageWrapper from '@/components/utils/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SignUpForm from '@/components/auth/SignUpForm';
import Button from '@/components/ui-custom/Button';

const SignUp: React.FC = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-mesh flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl mt-4">Create an account</CardTitle>
            <CardDescription>Please enter your information to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
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

export default SignUp;
