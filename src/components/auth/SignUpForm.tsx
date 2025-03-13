
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Button from '@/components/ui-custom/Button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Confirm your password' }),
  role: z.enum(['parent', 'tutor'], { 
    required_error: 'Please select a role' 
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const SignUpForm: React.FC = () => {
  const { signUp, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setError(null);
      console.log('Submitting form with values:', values);
      await signUp(values.email, values.password, values.role, values.name);
      toast.success('Account created! Please check your email for verification.', {
        duration: 5000
      });
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to sign up');
    }
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value as UserRole);
    form.setValue('role', value as 'parent' | 'tutor');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Create a password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>I am a:</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={handleRoleChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className={`flex items-center space-x-3 rounded-md border p-4 cursor-pointer ${selectedRole === 'parent' ? 'border-primary bg-primary/5' : 'border-input'}`}>
                      <RadioGroupItem value="parent" id="parent" />
                      <label
                        htmlFor="parent"
                        className="flex flex-col cursor-pointer"
                      >
                        <span className="font-medium">Parent</span>
                        <span className="text-sm text-muted-foreground">
                          I'm looking for tutoring services for my child
                        </span>
                      </label>
                    </div>
                    
                    <div className={`flex items-center space-x-3 rounded-md border p-4 cursor-pointer ${selectedRole === 'tutor' ? 'border-primary bg-primary/5' : 'border-input'}`}>
                      <RadioGroupItem value="tutor" id="tutor" />
                      <label
                        htmlFor="tutor"
                        className="flex flex-col cursor-pointer"
                      >
                        <span className="font-medium">Tutor</span>
                        <span className="text-sm text-muted-foreground">
                          I want to offer my tutoring services
                        </span>
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Choose the role that best describes you
                </FormDescription>
              </FormItem>
            )}
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
