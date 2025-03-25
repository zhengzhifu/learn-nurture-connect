
import { supabase } from '@/integrations/supabase/client';
import { Specialty } from '@/types/auth';
import { BaseService } from './base/BaseService';

export class SpecialtyService extends BaseService {
  async fetchUserSpecialties(tutorId: string): Promise<Specialty[]> {
    try {
      console.log(`Fetching specialties for tutor: ${tutorId}`);
      
      const { data, error } = await this.supabase
        .from('specialties')
        .select('*')
        .eq('tutor_id', tutorId);
      
      if (error) {
        console.error('Error fetching specialties:', error);
        return [];
      }
      
      return data as Specialty[];
    } catch (error) {
      console.error('Exception in fetchUserSpecialties:', error);
      return [];
    }
  }
  
  async addSpecialty(tutorId: string, specialty: Omit<Specialty, 'id' | 'tutor_id' | 'created_at'>): Promise<Specialty | null> {
    try {
      console.log(`Adding specialty for tutor: ${tutorId}`, specialty);
      
      const { data, error } = await this.supabase
        .from('specialties')
        .insert({
          tutor_id: tutorId,
          specialty_type: specialty.specialty_type,
          specialty_name: specialty.specialty_name
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error adding specialty:', error);
        return null;
      }
      
      return data as Specialty;
    } catch (error) {
      console.error('Exception in addSpecialty:', error);
      return null;
    }
  }
  
  async deleteSpecialty(specialtyId: string): Promise<boolean> {
    try {
      console.log(`Deleting specialty: ${specialtyId}`);
      
      const { error } = await this.supabase
        .from('specialties')
        .delete()
        .eq('id', specialtyId);
      
      if (error) {
        console.error('Error deleting specialty:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Exception in deleteSpecialty:', error);
      return false;
    }
  }
}

export const specialtyService = new SpecialtyService();
