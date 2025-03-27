
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Fetch the tutor's hourly rate
export const fetchTutorRate = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('tutors')
      .select('hourly_rate')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching tutor rate:', error);
      return 0; // Default to 0 if there's an error
    }

    // Return the hourly rate or 0 if it's null
    return data?.hourly_rate ?? 0;
  } catch (error) {
    console.error('Exception fetching tutor rate:', error);
    return 0;
  }
};

// Update the tutor's hourly rate
export const updateTutorRate = async (userId: string, hourlyRate: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tutors')
      .update({ hourly_rate: hourlyRate })
      .eq('id', userId);

    if (error) {
      console.error('Error updating tutor rate:', error);
      toast.error('Failed to update hourly rate');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception updating tutor rate:', error);
    toast.error('Failed to update hourly rate');
    return false;
  }
};
