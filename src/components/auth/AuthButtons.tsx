
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui-custom/Button';
import { LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AuthButtons: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signOut, profile } = useAuth();

  // Helper to get initials from name
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation is handled in AuthProvider
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isAuthenticated && profile) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2" aria-label="User menu">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name} />
                <AvatarFallback>{getInitials(profile.full_name)}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline truncate max-w-[100px]">{profile.full_name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>我的账户</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/dashboard')}>
              控制面板
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              个人设置
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Add a clear logout button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSignOut}
          className="border-destructive text-destructive hover:bg-destructive/10"
          icon={<LogOut className="h-4 w-4" />}
        >
          <span className="hidden sm:inline">退出</span>
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
        登录
      </Button>
      <Button 
        variant="primary" 
        size="sm" 
        onClick={() => navigate('/signup')}
        icon={<LogIn className="h-4 w-4" />}
        fullWidth={typeof window !== 'undefined' && window.innerWidth < 768}
      >
        注册
      </Button>
    </div>
  );
};

export default AuthButtons;
