
import React from 'react';
import { Book, Calendar, Users, Star, Bell, Settings, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import Button from '@/components/ui-custom/Button';
import { Profile } from '@/types/auth';

interface DashboardSidebarProps {
  userData: Profile | { 
    full_name?: string; 
    user_type?: string;
    avatar_url?: string; 
  } | null;
  isLoading: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ userData, isLoading }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="lg:w-1/4">
      <div className="sticky top-24 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              {isLoading ? (
                <>
                  <Skeleton className="h-24 w-24 rounded-full mb-4" />
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-20 mb-4" />
                </>
              ) : (
                <>
                  {userData?.avatar_url ? (
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={userData.avatar_url} alt={userData.full_name} />
                      <AvatarFallback>{getInitials(userData?.full_name || "User")}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                  )}
                  <h3 className="font-semibold text-xl mb-1">{userData?.full_name || "User"}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {userData?.user_type ? userData.user_type.charAt(0).toUpperCase() + userData.user_type.slice(1) : "User"}
                  </p>
                </>
              )}
              <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = "/profile"}>
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <nav className="space-y-1">
              <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md bg-primary/10 text-primary">
                <Book className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </a>
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
      </div>
    </div>
  );
};

export default DashboardSidebar;
