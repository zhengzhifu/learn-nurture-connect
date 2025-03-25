
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Form } from "@/components/ui/form";
import Button from '@/components/ui-custom/Button';
import { toast } from 'sonner';
import { signUpFormSchema, SignUpFormValues } from '@/types/auth/signUp';
import FormError from './FormError';
import PersonalInfoFields from './PersonalInfoFields';
import PasswordFields from './PasswordFields';
import RoleSelector from './RoleSelector';

const SignUpForm: React.FC = () => {
  const { signUp, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'parent' | 'tutor' | null>(null);
  
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: undefined,
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      setError(null);
      console.log('Submitting form with values:', values);
      await signUp(values.email, values.password, values.role, values.firstName, values.lastName);
      toast.success('Account created! Please check your email for verification.', {
        duration: 5000
      });
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to sign up');
    }
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value as 'parent' | 'tutor');
    form.setValue('role', value as 'parent' | 'tutor');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormError error={error} />
          
          <PersonalInfoFields form={form} />
          
          <PasswordFields form={form} />
          
          <RoleSelector 
            form={form} 
            selectedRole={selectedRole} 
            handleRoleChange={handleRoleChange} 
          />
          
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
