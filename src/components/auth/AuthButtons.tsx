
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui-custom/Button';
import { LogIn } from 'lucide-react';

const AuthButtons: React.FC = () => {
  const navigate = useNavigate();

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
