
import React from 'react';
import { UserRole } from '@/types/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SchoolSelector from './SchoolSelector';

interface SchoolInfoSectionProps {
  userType: UserRole;
  schoolId: string | undefined;
  otherSchoolName: string | undefined;
  onSchoolChange: (schoolId: string | undefined, otherSchoolName: string | undefined) => void;
}

const SchoolInfoSection: React.FC<SchoolInfoSectionProps> = ({
  userType,
  schoolId,
  otherSchoolName,
  onSchoolChange
}) => {
  const getSchoolLabel = () => {
    if (userType === 'tutor') return 'Your School';
    if (userType === 'parent') return 'Child\'s School';
    return 'School';
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>School Information</CardTitle>
        <CardDescription>Select your school or add a new one</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SchoolSelector
          selectedSchoolId={schoolId}
          otherSchoolName={otherSchoolName}
          onSchoolChange={onSchoolChange}
          label={getSchoolLabel()}
        />
      </CardContent>
    </Card>
  );
};

export default SchoolInfoSection;
