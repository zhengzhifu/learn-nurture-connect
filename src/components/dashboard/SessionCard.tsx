
import React from 'react';
import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui-custom/Button';

interface SessionCardProps {
  date: string;
  time: string;
  sessionType: string;
  title: string;
  tutor: string;
}

const SessionCard: React.FC<SessionCardProps> = ({ date, time, sessionType, title, tutor }) => {
  return (
    <Card className="hover-lift">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row overflow-hidden">
          <div className="bg-primary/5 p-6 md:w-1/3">
            <p className="text-sm text-muted-foreground mb-1">{date}</p>
            <p className="text-xl font-semibold mb-1">{time}</p>
            <div className={`inline-flex items-center rounded-full ${
              sessionType === 'Tutoring' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            } px-2.5 py-0.5 text-xs font-medium mt-2`}>
              {sessionType}
            </div>
          </div>
          <div className="p-6 md:w-2/3">
            <h4 className="font-semibold text-lg mb-2">{title}</h4>
            <div className="flex items-center text-muted-foreground text-sm mb-4">
              <User className="h-4 w-4 mr-2" />
              <span>with {tutor}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button variant="outline" size="sm">
                Reschedule
              </Button>
              <Button variant="outline" size="sm" className="text-red-500">
                Cancel
              </Button>
              <Button variant="primary" size="sm">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
