
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Star, 
  Bell, 
  Settings 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SidebarNavigation: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <nav className="space-y-1">
          <Link to="/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-md bg-primary/10 text-primary">
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-foreground hover:bg-gray-100 transition-colors">
            <Calendar className="h-5 w-5" />
            <span>Bookings</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-foreground hover:bg-gray-100 transition-colors">
            <Users className="h-5 w-5" />
            <span>My Tutors</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-foreground hover:bg-gray-100 transition-colors">
            <Star className="h-5 w-5" />
            <span>Reviews</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-foreground hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-foreground hover:bg-gray-100 transition-colors">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </a>
        </nav>
      </CardContent>
    </Card>
  );
};

export default SidebarNavigation;
