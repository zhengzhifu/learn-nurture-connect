
import React from 'react';
import { ApprovalStatus } from '@/types/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ApprovalStatusAlertProps {
  status: ApprovalStatus | undefined;
}

const ApprovalStatusAlert: React.FC<ApprovalStatusAlertProps> = ({ status }) => {
  if (!status) return null;
  
  switch (status) {
    case 'pending':
      return (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Profile Pending Approval</AlertTitle>
          <AlertDescription>
            Your profile is currently under review. Once approved, you'll be able to access all platform features.
          </AlertDescription>
        </Alert>
      );
    case 'rejected':
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Profile Approval Rejected</AlertTitle>
          <AlertDescription>
            Your profile has been rejected. Please update your information and try again.
          </AlertDescription>
        </Alert>
      );
    case 'approved':
      return (
        <Alert variant="default" className="mb-6 bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Profile Approved</AlertTitle>
          <AlertDescription className="text-green-700">
            Your profile has been approved! You can now use all platform features.
          </AlertDescription>
        </Alert>
      );
    default:
      return null;
  }
};

export default ApprovalStatusAlert;
