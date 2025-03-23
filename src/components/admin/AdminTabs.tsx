
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PendingApprovalsTab from './PendingApprovalsTab';
import AllUsersTab from './AllUsersTab';
import AllSchoolsTab from './AllSchoolsTab';
import { Profile, School } from '@/types/auth';

interface AdminTabsProps {
  users: Profile[];
  schools: School[];
  isLoading: boolean;
  onApproveUser: (userId: string) => Promise<void>;
  onRejectUser: (userId: string) => Promise<void>;
  onApproveSchool: (schoolId: string) => Promise<void>;
  onRejectSchool: (schoolId: string) => Promise<void>;
}

const AdminTabs: React.FC<AdminTabsProps> = ({
  users,
  schools,
  isLoading,
  onApproveUser,
  onRejectUser,
  onApproveSchool,
  onRejectSchool
}) => {
  const pendingUsers = users.filter(user => !user.approval_status || user.approval_status === 'pending');
  const pendingSchools = schools.filter(school => school.status === 'pending');

  return (
    <Tabs defaultValue="pending">
      <TabsList className="mb-6">
        <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
        <TabsTrigger value="users">All Users</TabsTrigger>
        <TabsTrigger value="schools">All Schools</TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending">
        <PendingApprovalsTab 
          pendingUsers={pendingUsers}
          pendingSchools={pendingSchools}
          isLoading={isLoading}
          onApproveUser={onApproveUser}
          onRejectUser={onRejectUser}
          onApproveSchool={onApproveSchool}
          onRejectSchool={onRejectSchool}
        />
      </TabsContent>
      
      <TabsContent value="users">
        <AllUsersTab 
          users={users}
          isLoading={isLoading}
          onApproveUser={onApproveUser}
          onRejectUser={onRejectUser}
        />
      </TabsContent>
      
      <TabsContent value="schools">
        <AllSchoolsTab 
          schools={schools}
          isLoading={isLoading}
          onApproveSchool={onApproveSchool}
          onRejectSchool={onRejectSchool}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
