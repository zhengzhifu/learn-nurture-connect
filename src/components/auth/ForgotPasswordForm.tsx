
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { requestPasswordReset } from '@/services/auth';
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import Button from '@/components/ui-custom/Button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const emailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type EmailFormValue = z.infer<typeof emailSchema>;

interface ForgotPasswordFormProps {
  onBackToSignIn: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToSignIn }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const resetPasswordForm = useForm<EmailFormValue>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleResetPassword = async (values: EmailFormValue) => {
    try {
      setError(null);
      setIsLoading(true);
      
      await requestPasswordReset(values.email, `${window.location.origin}/reset-password`);
      
      setResetEmailSent(true);
      toast.success('Password reset email sent, please check your inbox');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
      toast.error(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Form {...resetPasswordForm}>
        <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {resetEmailSent && (
            <Alert>
              <AlertDescription>
                Password reset email has been sent. Please check your inbox.
              </AlertDescription>
            </Alert>
          )}
          
          <FormField
            control={resetPasswordForm.control}
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
          
          <Button type="submit" fullWidth disabled={isLoading || resetEmailSent}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
          
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              <button 
                type="button" 
                onClick={onBackToSignIn} 
                className="text-primary font-medium hover:underline"
              >
                Back to Login
              </button>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
