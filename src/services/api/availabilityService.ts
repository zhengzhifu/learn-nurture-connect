
import { supabase } from '@/integrations/supabase/client';
import { Availability } from '@/types/auth';
import { BaseService } from './base/BaseService';

export class AvailabilityService extends BaseService {
  
  async fetchUserAvailability(tutorId: string): Promise<Availability[]> {
    try {
      console.log(`Fetching availability for tutor: ${tutorId}`);
      
      const { data, error } = await this.supabase
        .from('availability')
        .select('*')
        .eq('tutor_id', tutorId);
      
      if (error) {
        console.error('Error fetching availability:', error);
        return [];
      }
      
      return data as Availability[];
    } catch (error) {
      console.error('Exception in fetchUserAvailability:', error);
      return [];
    }
  }
  
  async addAvailability(tutorId: string, availability: Omit<Availability, 'id' | 'tutor_id' | 'created_at' | 'updated_at'>): Promise<Availability | null> {
    try {
      console.log(`Adding availability for tutor: ${tutorId}`, availability);
      
      const { data, error } = await this.supabase
        .from('availability')
        .insert({
          tutor_id: tutorId,
          day_of_week: availability.day_of_week,
          start_time: availability.start_time,
          end_time: availability.end_time
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error adding availability:', error);
        return null;
      }
      
      return data as Availability;
    } catch (error) {
      console.error('Exception in addAvailability:', error);
      return null;
    }
  }
  
  async removeAvailability(availabilityId: string): Promise<boolean> {
    try {
      console.log(`Deleting availability: ${availabilityId}`);
      
      const { error } = await this.supabase
        .from('availability')
        .delete()
        .eq('id', availabilityId);
      
      if (error) {
        console.error('Error deleting availability:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Exception in removeAvailability:', error);
      return false;
    }
  }
}

// Export the class and an instance for direct usage
export const availabilityService = new AvailabilityService();

// Export the specific methods to maintain backward compatibility
export const fetchUserAvailability = (tutorId: string) => availabilityService.fetchUserAvailability(tutorId);
export const addAvailability = (tutorId: string, availability: Omit<Availability, 'id' | 'tutor_id' | 'created_at' | 'updated_at'>) => 
  availabilityService.addAvailability(tutorId, availability);
export const removeAvailability = (availabilityId: string) => availabilityService.removeAvailability(availabilityId);
