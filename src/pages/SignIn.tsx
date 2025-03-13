
import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import PageWrapper from '@/components/utils/PageWrapper';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SignIn: React.FC = () => {
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
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <Input id="email" type="email" placeholder="Your email address" />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">Password</label>
                <Input id="password" type="password" placeholder="Your password" />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <div className="text-center text-sm mt-4">
                <p className="text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary font-medium hover:underline">
                    Sign up
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

export default SignIn;
