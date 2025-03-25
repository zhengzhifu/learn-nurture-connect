
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useParentData = (userId: string | undefined, userType: string | undefined) => {
  const [parentData, setParentData] = useState({
    num_children: 0,
    preferred_communication: 'email'
  });
  
  const [isLoadingParentData, setIsLoadingParentData] = useState(false);

  useEffect(() => {
    if (userType === 'parent' && userId) {
      fetchParentData(userId);
    }
  }, [userType, userId]);

  const fetchParentData = async (userId: string) => {
    setIsLoadingParentData(true);
    try {
      const { data, error } = await supabase
        .from('parents')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching parent data:', error);
        toast.error('Failed to load parent information');
      } else if (data) {
        setParentData({
          num_children: data.num_children || 0,
          preferred_communication: data.preferred_communication || 'email'
        });
      }
    } catch (error) {
      console.error('Exception fetching parent data:', error);
    } finally {
      setIsLoadingParentData(false);
    }
  };

  const handleParentDataChange = (field: string, value: string | number) => {
    setParentData(prev => ({ ...prev, [field]: value }));
  };

  return {
    parentData,
    isLoadingParentData,
    handleParentDataChange
  };
};
