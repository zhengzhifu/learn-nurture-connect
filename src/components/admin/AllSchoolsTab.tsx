
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import SchoolTable from './SchoolTable';
import { School } from '@/types/auth';

interface AllSchoolsTabProps {
  schools: School[];
  isLoading: boolean;
  onApproveSchool: (schoolId: string) => Promise<void>;
  onRejectSchool: (schoolId: string) => Promise<void>;
}

const AllSchoolsTab: React.FC<AllSchoolsTabProps> = ({
  schools,
  isLoading,
  onApproveSchool,
  onRejectSchool
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Schools</CardTitle>
        <CardDescription>
          {schools.length} schools in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SchoolTable 
          schools={schools} 
          isLoading={isLoading}
          onApproveSchool={onApproveSchool}
          onRejectSchool={onRejectSchool}
        />
      </CardContent>
    </Card>
  );
};

export default AllSchoolsTab;
