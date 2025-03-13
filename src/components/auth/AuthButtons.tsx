
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui-custom/Button';
import { LogIn, LogOut, User } from 'lucide-react';

const AuthButtons: React.FC = () => {
  const { isAuthenticated, signOut, user } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm hidden md:block">
          <span className="text-muted-foreground">Welcome, </span>
          <span className="font-medium">{user?.name || user?.email}</span>
          {user?.role && (
            <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {user.role}
            </span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
          icon={<User className="h-4 w-4" />}
        >
          Dashboard
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={signOut}
          icon={<LogOut className="h-4 w-4" />}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full md:w-auto">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate('/signin')}
        fullWidth={typeof window !== 'undefined' && window.innerWidth < 768}
      >
        Sign In
      </Button>
      <Button 
        variant="primary" 
        size="sm" 
        onClick={() => navigate('/signup')}
        icon={<LogIn className="h-4 w-4" />}
        fullWidth={typeof window !== 'undefined' && window.innerWidth < 768}
      >
        Sign Up
      </Button>
    </div>
  );
};

export default AuthButtons;
