
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '@/components/ui-custom/Button';

interface DashboardErrorProps {
  error: string | null;
  onRetry: () => void;
}

const DashboardError: React.FC<DashboardErrorProps> = ({ error, onRetry }) => {
  return (
    <div className="container mx-auto px-4 py-24 min-h-screen flex flex-col items-center justify-center">
      <AlertCircle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-2xl font-bold mb-4">Error Loading Dashboard</h2>
      <p className="text-center text-muted-foreground mb-8 max-w-md">{error}</p>
      <Button onClick={onRetry}>
        <RefreshCw className="mr-2" /> Retry
      </Button>
    </div>
  );
};

export default DashboardError;
