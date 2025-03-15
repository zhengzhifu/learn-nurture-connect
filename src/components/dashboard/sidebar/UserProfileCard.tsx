
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Button from '@/components/ui-custom/Button';
import UserAvatar from './UserAvatar';
import { Profile } from '@/types/auth';

interface UserProfileCardProps {
  userData: Profile | { 
    full_name?: string; 
    user_type?: string;
    avatar_url?: string; 
  } | null;
  isLoading: boolean;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ userData, isLoading }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <UserAvatar 
            avatarUrl={userData?.avatar_url} 
            fullName={userData?.full_name || "User"}
            isLoading={isLoading}
          />
          
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-20 mb-4" />
            </>
          ) : (
            <>
              <h3 className="font-semibold text-xl mb-1">{userData?.full_name || "User"}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {userData?.user_type ? userData.user_type.charAt(0).toUpperCase() + userData.user_type.slice(1) : "User"}
              </p>
            </>
          )}
          
          <Link to="/profile" className="w-full">
            <Button variant="outline" size="sm" className="w-full" icon={<Edit className="h-4 w-4 mr-2" />}>
              Edit Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
