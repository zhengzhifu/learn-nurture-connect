
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import UserTable from './UserTable';
import SchoolTable from './SchoolTable';
import { Profile, School } from '@/types/auth';

interface PendingApprovalsTabProps {
  pendingUsers: Profile[];
  pendingSchools: School[];
  isLoading: boolean;
  onApproveUser: (userId: string) => Promise<void>;
  onRejectUser: (userId: string) => Promise<void>;
  onApproveSchool: (schoolId: string) => Promise<void>;
  onRejectSchool: (schoolId: string) => Promise<void>;
}

const PendingApprovalsTab: React.FC<PendingApprovalsTabProps> = ({
  pendingUsers,
  pendingSchools,
  isLoading,
  onApproveUser,
  onRejectUser,
  onApproveSchool,
  onRejectSchool
}) => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Pending User Approvals</CardTitle>
          <CardDescription>
            {pendingUsers.length} users waiting for approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserTable 
            users={pendingUsers} 
            isLoading={isLoading}
            onApproveUser={onApproveUser}
            onRejectUser={onRejectUser}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending School Approvals</CardTitle>
          <CardDescription>
            {pendingSchools.length} schools waiting for approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SchoolTable 
            schools={pendingSchools} 
            isLoading={isLoading}
            onApproveSchool={onApproveSchool}
            onRejectSchool={onRejectSchool}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApprovalsTab;
