
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Loader2 } from 'lucide-react';
import Button from '@/components/ui-custom/Button';

interface ProfileFormActionsProps {
  isSaving: boolean;
}

const ProfileFormActions: React.FC<ProfileFormActionsProps> = ({ isSaving }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        onClick={() => navigate('/dashboard')}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSaving}
        icon={isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};

export default ProfileFormActions;
