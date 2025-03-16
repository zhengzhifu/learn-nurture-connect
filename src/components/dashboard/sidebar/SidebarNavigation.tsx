
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Star
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SidebarNavigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => currentPath === path;
  
  return (
    <Card>
      <CardContent className="p-4">
        <nav className="space-y-1">
          <Link 
            to="/dashboard" 
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/dashboard') 
                ? 'bg-primary/10 text-primary' 
                : 'text-foreground hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className={isActive('/dashboard') ? 'font-medium' : ''}>Dashboard</span>
          </Link>
          
          <Link 
            to="/my-tutors" 
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/my-tutors') 
                ? 'bg-primary/10 text-primary' 
                : 'text-foreground hover:bg-gray-100'
            }`}
          >
            <Users className="h-5 w-5" />
            <span className={isActive('/my-tutors') ? 'font-medium' : ''}>My Tutors</span>
          </Link>
          
          <Link 
            to="/reviews" 
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              isActive('/reviews') 
                ? 'bg-primary/10 text-primary' 
                : 'text-foreground hover:bg-gray-100'
            }`}
          >
            <Star className="h-5 w-5" />
            <span className={isActive('/reviews') ? 'font-medium' : ''}>Reviews</span>
          </Link>
        </nav>
      </CardContent>
    </Card>
  );
};

export default SidebarNavigation;
