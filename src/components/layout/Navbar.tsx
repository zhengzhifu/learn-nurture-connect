
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import Button from '@/components/ui-custom/Button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { isTokenExpired } from '@/services/auth/sessionService';
import AuthButtons from '@/components/auth/AuthButtons';

const Navbar: React.FC = () => {
  const { isAuthenticated, signOut, profile, user } = useAuth();
  const isTokenValid = !isTokenExpired();
  const isActuallyAuthenticated = isAuthenticated && isTokenValid;

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const ProfileButton = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name} />
              <AvatarFallback>{getInitials(profile?.full_name || 'User')}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/reviews">Reviews</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-700">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="bg-white border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="font-semibold text-2xl">
          Tutor<span className="text-primary">Find</span>
        </Link>
        <div className="flex items-center gap-5">
          <NavLink to="/browse">Browse</NavLink>
          {isActuallyAuthenticated ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/reviews">Reviews</NavLink>
              <ProfileButton />
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/signin">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
