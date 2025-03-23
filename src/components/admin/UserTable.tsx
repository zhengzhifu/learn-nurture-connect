
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ColumnDef } from '@tanstack/react-table';
import { Profile } from '@/types/auth';

interface UserTableProps {
  users: Profile[];
  isLoading: boolean;
  onApproveUser: (userId: string) => Promise<void>;
  onRejectUser: (userId: string) => Promise<void>;
}

const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  isLoading, 
  onApproveUser, 
  onRejectUser 
}) => {
  const userColumns: ColumnDef<Profile>[] = [
    {
      accessorKey: 'avatar_url',
      header: '',
      cell: ({ row }) => {
        const user = row.original;
        const initials = user.full_name
          ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
          : 'U';
          
        return (
          <Avatar>
            <AvatarImage src={user.avatar_url || ''} alt={user.full_name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: 'full_name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'user_type',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.original.user_type;
        return (
          <Badge variant={
            role === 'admin' ? 'destructive' : 
            role === 'tutor' ? 'default' : 
            'secondary'
          }>
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'approval_status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.approval_status;
        return (
          <Badge variant={
            status === 'approved' ? 'default' : 
            status === 'rejected' ? 'destructive' : 
            'outline'
          }>
            {status || 'pending'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original;
        const isPending = !user.approval_status || user.approval_status === 'pending';
        
        if (!isPending) return null;
        
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onApproveUser(user.id)}
            >
              Approve
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onRejectUser(user.id)}
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable 
      columns={userColumns} 
      data={users} 
      isLoading={isLoading}
    />
  );
};

export default UserTable;
