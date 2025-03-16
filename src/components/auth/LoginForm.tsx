
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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

const formSchema = z.object({
  email: z.string().email({ message: '请输入有效的电子邮箱地址' }),
  password: z.string().min(6, { message: '密码至少需要6个字符' }),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setError(null);
      setIsLoading(true);
      
      console.log('Attempting to sign in with:', values.email);
      await signIn(values.email, values.password);
      
      // Navigation is handled by the AuthProvider when isAuthenticated becomes true
    } catch (err: any) {
      console.error('Sign in error:', err);
      let errorMessage = '登录失败';
      
      // Provide more user-friendly error messages
      if (err.message.includes('Invalid login credentials')) {
        errorMessage = '邮箱或密码错误';
      } else if (err.message.includes('Email not confirmed')) {
        errorMessage = '请先验证您的邮箱';
      } else if (err.message.includes('network')) {
        errorMessage = '网络错误，请检查您的网络连接';
      } else {
        errorMessage = err.message || '登录失败';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>密码</FormLabel>
                  <button 
                    type="button" 
                    onClick={onForgotPassword} 
                    className="text-xs text-primary hover:underline"
                  >
                    忘记密码?
                  </button>
                </div>
                <FormControl>
                  <Input type="password" placeholder="您的密码" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? '登录中...' : '登录'}
          </Button>
          
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              还没有账号?{' '}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                注册
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
