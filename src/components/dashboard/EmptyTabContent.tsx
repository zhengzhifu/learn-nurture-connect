
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui-custom/Button';

interface EmptyTabContentProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
}

const EmptyTabContent: React.FC<EmptyTabContentProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText 
}) => {
  return (
    <Card>
      <CardContent className="py-8">
        <div className="text-center">
          <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium mb-2">{title}</h4>
          <p className="text-muted-foreground mb-6">{description}</p>
          <Button variant="outline">
            {buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyTabContent;
