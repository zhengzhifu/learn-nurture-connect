
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui-custom/Button';

interface ProfileHeaderProps {
  title: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center mb-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/dashboard')}
        className="mr-4"
        icon={<ArrowLeft className="h-4 w-4" />}
      >
        Back to Dashboard
      </Button>
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};

export default ProfileHeader;
