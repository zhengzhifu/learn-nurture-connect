
import React from 'react';
import { RefreshCw } from 'lucide-react';
import Button from '@/components/ui-custom/Button';

interface LoadingTimeoutProps {
  onRetry: () => void;
}

const LoadingTimeout: React.FC<LoadingTimeoutProps> = ({ onRetry }) => {
  return (
    <div className="container mx-auto px-4 py-24 min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Taking longer than expected...</h2>
      <p className="text-center text-muted-foreground mb-8 max-w-md">
        The dashboard is taking a while to load. This might be due to a network issue.
      </p>
      <Button onClick={onRetry}>
        <RefreshCw className="mr-2" /> Reload Page
      </Button>
    </div>
  );
};

export default LoadingTimeout;
