
import React from 'react';
import { Profile } from '@/types/auth';
import UserProfileCard from './sidebar/UserProfileCard';
import SidebarNavigation from './sidebar/SidebarNavigation';

interface DashboardSidebarProps {
  userData: {
    full_name?: string;
    user_type?: string;
    avatar_url?: string;
  } | null;
  isLoading: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ userData, isLoading }) => {
  return (
    <div className="lg:w-1/4">
      <div className="sticky top-24 space-y-6">
        <UserProfileCard userData={userData} isLoading={isLoading} />
        <SidebarNavigation />
      </div>
    </div>
  );
};

export default DashboardSidebar;
