
import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import PageWrapper from '@/components/utils/PageWrapper';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
            <CardDescription>Sign up to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
                <Input id="name" type="text" placeholder="Your full name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <Input id="email" type="email" placeholder="Your email address" />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">Password</label>
                <Input id="password" type="password" placeholder="Create a password" />
              </div>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
              <div className="text-center text-sm mt-4">
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-primary font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default SignUp;
