
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AvailabilityManager from './AvailabilityManager';
import SpecialtyManager from './SpecialtyManager';
import HourlyRateSetup from './HourlyRateSetup';

interface TutorServiceDetailsProps {
  userId: string;
  userType: "parent" | "tutor";
}

const TutorServiceDetails: React.FC<TutorServiceDetailsProps> = ({ userId, userType }) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Service Details</CardTitle>
        <CardDescription>Manage your availability and specialties</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <HourlyRateSetup userId={userId} />
        
        <Separator />
        
        <AvailabilityManager userId={userId} />
        
        <Separator />
        
        <SpecialtyManager userId={userId} userType={userType} />
      </CardContent>
    </Card>
  );
};

export default TutorServiceDetails;
