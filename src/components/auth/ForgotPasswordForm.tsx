
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
  email: z.string().email({ message: '请输入有效的电子邮箱地址' }),
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
      toast.success('密码重置邮件已发送，请检查您的邮箱');
    } catch (err: any) {
      setError(err.message || '发送重置邮件失败');
      toast.error(err.message || '发送重置邮件失败');
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
                密码重置邮件已发送。请检查您的邮箱。
              </AlertDescription>
            </Alert>
          )}
          
          <FormField
            control={resetPasswordForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input placeholder="您的邮箱地址" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" fullWidth disabled={isLoading || resetEmailSent}>
            {isLoading ? '发送中...' : '发送重置链接'}
          </Button>
          
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              <button 
                type="button" 
                onClick={onBackToSignIn} 
                className="text-primary font-medium hover:underline"
              >
                返回登录
              </button>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
