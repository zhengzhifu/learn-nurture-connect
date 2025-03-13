import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type UserRole = 'parent' | 'tutor' | null;

interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole, name?: string) => Promise<void>;
  signOut: () => void;
}

// Export the AuthContext directly so it can be imported in the useAuth hook
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock sign in function - in a real app this would call an API
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would validate credentials against a backend
      // For demo purposes, we'll allow any login with a valid email format
      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }
      
      // Create a mock user
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 15),
        email,
        role: localStorage.getItem(`role_${email}`) as UserRole || null
      };
      
      // Check if the user has a role (has signed up)
      if (!mockUser.role) {
        throw new Error('User not found. Please sign up first.');
      }
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast.success('Signed in successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock sign up function - in a real app this would call an API
  const signUp = async (email: string, password: string, role: UserRole, name?: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate email
      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }
      
      // Validate role
      if (!role) {
        throw new Error('Please select a role (parent or tutor)');
      }

      // Create a mock user
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 15),
        email,
        role,
        name
      };
      
      // Store the user role for future sign-ins
      localStorage.setItem(`role_${email}`, role);
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign up');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Signed out');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      signIn, 
      signUp, 
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};
