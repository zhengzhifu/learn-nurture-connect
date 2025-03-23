
import React from 'react';
import { UserRole } from '@/types/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SchoolSelector from './SchoolSelector';

interface SchoolInfoSectionProps {
  userType: UserRole;
  schoolId: string | undefined;
  otherSchoolName: string | undefined;
  childSchoolId: string | undefined;
  onSchoolChange: (schoolId: string | undefined, otherSchoolName: string | undefined) => void;
  onChildSchoolChange: (schoolId: string | undefined, otherSchoolName: string | undefined) => void;
}

const SchoolInfoSection: React.FC<SchoolInfoSectionProps> = ({
  userType,
  schoolId,
  otherSchoolName,
  childSchoolId,
  onSchoolChange,
  onChildSchoolChange
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>School Information</CardTitle>
        <CardDescription>Select your school or add a new one</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {userType === 'tutor' && (
          <SchoolSelector
            selectedSchoolId={schoolId}
            otherSchoolName={otherSchoolName}
            onSchoolChange={onSchoolChange}
            label="Your School"
          />
        )}
        
        {userType === 'parent' && (
          <SchoolSelector
            selectedSchoolId={childSchoolId}
            otherSchoolName={undefined}
            onSchoolChange={onChildSchoolChange}
            label="Child's School"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SchoolInfoSection;
