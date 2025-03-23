
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import UserTable from './UserTable';
import { Profile } from '@/types/auth';

interface AllUsersTabProps {
  users: Profile[];
  isLoading: boolean;
  onApproveUser: (userId: string) => Promise<void>;
  onRejectUser: (userId: string) => Promise<void>;
}

const AllUsersTab: React.FC<AllUsersTabProps> = ({
  users,
  isLoading,
  onApproveUser,
  onRejectUser
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>
          {users.length} users registered in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserTable 
          users={users} 
          isLoading={isLoading}
          onApproveUser={onApproveUser}
          onRejectUser={onRejectUser}
        />
      </CardContent>
    </Card>
  );
};

export default AllUsersTab;
