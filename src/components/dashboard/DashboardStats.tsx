
import React from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Upcoming Sessions</p>
              <h4 className="text-2xl font-bold">3</h4>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Active Tutors</p>
              <h4 className="text-2xl font-bold">2</h4>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Hours This Month</p>
              <h4 className="text-2xl font-bold">12</h4>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
