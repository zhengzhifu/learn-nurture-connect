
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Users,
  Star,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/auth/useAuth';

const SidebarNavigation: React.FC = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      console.log('SidebarNavigation: Sign out button clicked');
      await signOut();
      // Navigation is handled in AuthProvider
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="space-y-1">
      <Link to="/dashboard" className="flex items-center p-2 rounded-md hover:bg-muted">
        <LayoutDashboard className="h-5 w-5 mr-3 text-muted-foreground" />
        <span>Dashboard</span>
      </Link>
      <Link to="/browse" className="flex items-center p-2 rounded-md hover:bg-muted">
        <Users className="h-5 w-5 mr-3 text-muted-foreground" />
        <span>Browse Services</span>
      </Link>
      <Link to="/reviews" className="flex items-center p-2 rounded-md hover:bg-muted">
        <Star className="h-5 w-5 mr-3 text-muted-foreground" />
        <span>Reviews</span>
      </Link>
      <Link to="/profile" className="flex items-center p-2 rounded-md hover:bg-muted">
        <Settings className="h-5 w-5 mr-3 text-muted-foreground" />
        <span>Settings</span>
      </Link>
      <button 
        onClick={handleSignOut} 
        className="flex items-center p-2 w-full text-left rounded-md hover:bg-red-100 text-red-600 hover:text-red-700 mt-4"
      >
        <LogOut className="h-5 w-5 mr-3" />
        <span>Sign Out</span>
      </button>
    </div>
  );
};

export default SidebarNavigation;
