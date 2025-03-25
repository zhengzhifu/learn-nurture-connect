
import { supabase } from '@/integrations/supabase/client';
import { Availability } from '@/types/auth';
import { toast } from 'sonner';

// Fetch all availabilities for a user
export const fetchUserAvailability = async (userId: string): Promise<Availability[]> => {
  try {
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('tutor_id', userId)
      .order('day_of_week', { ascending: true });

    if (error) {
      console.error('Error fetching availability:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Exception fetching availability:', error);
    return [];
  }
};

// Add a new availability slot
export const addAvailability = async (
  userId: string, 
  day: string, 
  startTime: string, 
  endTime: string
): Promise<Availability | null> => {
  try {
    const { data, error } = await supabase
      .from('availability')
      .insert({
        tutor_id: userId,
        day_of_week: day,
        start_time: startTime,
        end_time: endTime
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding availability:', error);
      toast.error('Failed to add availability');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception adding availability:', error);
    toast.error('Failed to add availability');
    return null;
  }
};

// Remove an availability slot
export const removeAvailability = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('availability')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing availability:', error);
      toast.error('Failed to remove availability');
    }
  } catch (error) {
    console.error('Exception removing availability:', error);
    toast.error('Failed to remove availability');
  }
};
