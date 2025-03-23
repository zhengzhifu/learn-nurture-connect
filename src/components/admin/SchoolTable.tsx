
import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { School } from '@/types/auth';

interface SchoolTableProps {
  schools: School[];
  isLoading: boolean;
  onApproveSchool: (schoolId: string) => Promise<void>;
  onRejectSchool: (schoolId: string) => Promise<void>;
}

const SchoolTable: React.FC<SchoolTableProps> = ({ 
  schools, 
  isLoading, 
  onApproveSchool, 
  onRejectSchool 
}) => {
  const schoolColumns: ColumnDef<School>[] = [
    {
      accessorKey: 'name',
      header: 'School Name',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={
            status === 'approved' ? 'default' : 
            status === 'rejected' ? 'destructive' : 
            'outline'
          }>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return date.toLocaleDateString();
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const school = row.original;
        const isPending = school.status === 'pending';
        
        if (!isPending) return null;
        
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onApproveSchool(school.id)}
            >
              Approve
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onRejectSchool(school.id)}
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
      columns={schoolColumns} 
      data={schools} 
      isLoading={isLoading}
    />
  );
};

export default SchoolTable;
