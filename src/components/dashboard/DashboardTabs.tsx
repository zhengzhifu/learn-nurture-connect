
import React from 'react';
import { Clock, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SessionCard from './SessionCard';
import EmptyTabContent from './EmptyTabContent';

const DashboardTabs: React.FC = () => {
  return (
    <Tabs defaultValue="upcoming">
      <TabsList className="mb-6 bg-muted">
        <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
        <TabsTrigger value="past">Past Sessions</TabsTrigger>
        <TabsTrigger value="requests">Requests</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upcoming" className="space-y-4">
        <SessionCard
          date="Thursday, October 12"
          time="4:00 PM - 5:30 PM"
          sessionType="Tutoring"
          title="Math Tutoring - Algebra"
          tutor="Alex Thompson"
        />
        
        <SessionCard
          date="Saturday, October 14"
          time="10:00 AM - 1:00 PM"
          sessionType="Babysitting"
          title="Weekend Childcare"
          tutor="Emma Davis"
        />
      </TabsContent>
      
      <TabsContent value="past">
        <EmptyTabContent
          icon={Clock}
          title="No past sessions yet"
          description="Your completed sessions will appear here once you've had your first session."
          buttonText="Browse Tutors"
        />
      </TabsContent>
      
      <TabsContent value="requests">
        <EmptyTabContent
          icon={Users}
          title="No pending requests"
          description="When you send a request to a tutor or receive one, it will appear here."
          buttonText="Post a Request"
        />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
