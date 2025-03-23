
import { supabase } from '@/integrations/supabase/client';
import { Availability } from '@/types/auth';
import { toast } from 'sonner';

export const fetchUserAvailability = async (userId: string): Promise<Availability[]> => {
  try {
    console.log('Fetching availability for user:', userId);
    
    const { data, error } = await supabase
      .from('user_availability')
      .select('*')
      .eq('user_id', userId)
      .order('day_of_week');
      
    if (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
    
    console.log('Fetched availability:', data);
    return data as Availability[];
  } catch (error: any) {
    console.error('Error in fetchUserAvailability:', error);
    toast.error(`Failed to fetch availability: ${error.message}`);
    return [];
  }
};

export const addAvailability = async (
  userId: string, 
  dayOfWeek: string, 
  startTime: string, 
  endTime: string
): Promise<Availability | null> => {
  try {
    console.log('Adding availability for user:', userId, dayOfWeek, startTime, endTime);
    
    const { data, error } = await supabase
      .from('user_availability')
      .insert({
        user_id: userId,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error adding availability:', error);
      toast.error(`Failed to add availability: ${error.message}`);
      throw error;
    }
    
    console.log('Added availability:', data);
    return data as Availability;
  } catch (error: any) {
    console.error('Error in addAvailability:', error);
    return null;
  }
};

export const removeAvailability = async (id: string): Promise<void> => {
  try {
    console.log('Removing availability:', id);
    
    const { error } = await supabase
      .from('user_availability')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error removing availability:', error);
      toast.error(`Failed to remove availability: ${error.message}`);
      throw error;
    }
    
    console.log('Removed availability');
  } catch (error: any) {
    console.error('Error in removeAvailability:', error);
  }
};
