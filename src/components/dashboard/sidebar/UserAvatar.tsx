
import React from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface UserAvatarProps {
  avatarUrl?: string;
  fullName?: string;
  isLoading: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  avatarUrl, 
  fullName = "User", 
  isLoading 
}) => {
  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') return 'U';
    return name
      .split(' ')
      .map(part => part && part[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'U';
  };

  if (isLoading) {
    return <Skeleton className="h-24 w-24 rounded-full mb-4" />;
  }

  if (avatarUrl) {
    return (
      <Avatar className="h-24 w-24 mb-4">
        <AvatarImage src={avatarUrl} alt={fullName || 'User'} />
        <AvatarFallback>{getInitials(fullName || 'User')}</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
      <User className="h-12 w-12 text-primary" />
    </div>
  );
};

export default UserAvatar;
