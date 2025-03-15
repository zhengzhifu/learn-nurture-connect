
import React from 'react';
import { Profile } from '@/types/auth';
import UserProfileCard from './sidebar/UserProfileCard';
import SidebarNavigation from './sidebar/SidebarNavigation';

interface DashboardSidebarProps {
  userData: Profile | { 
    full_name?: string; 
    user_type?: string;
    avatar_url?: string; 
  } | null;
  isLoading: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ userData, isLoading }) => {
  // Create a safe version of userData to prevent recursion issues
  const safeUserData = userData ? {
    full_name: userData.full_name || 'User',
    user_type: userData.user_type || 'parent',
    avatar_url: userData.avatar_url,
  } : null;

  return (
    <div className="lg:w-1/4">
      <div className="sticky top-24 space-y-6">
        <UserProfileCard userData={safeUserData} isLoading={isLoading} />
        <SidebarNavigation />
      </div>
    </div>
  );
};

export default DashboardSidebar;
