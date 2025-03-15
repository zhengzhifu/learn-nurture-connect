
import React from 'react';
import { Loader2 } from 'lucide-react';

const ProfileLoadingState: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-24 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Loading Profile...</h2>
        <p className="text-muted-foreground">Please wait while we fetch your profile information.</p>
      </div>
    </div>
  );
};

export default ProfileLoadingState;
