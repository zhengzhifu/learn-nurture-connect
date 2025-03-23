
import { supabase } from '@/integrations/supabase/client';
import { Specialty } from '@/types/auth';
import { toast } from 'sonner';

export const fetchUserSpecialties = async (userId: string): Promise<Specialty[]> => {
  try {
    console.log('Fetching specialties for user:', userId);
    
    const { data, error } = await supabase
      .from('user_specialties')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching specialties:', error);
      throw error;
    }
    
    console.log('Fetched specialties:', data);
    return data as Specialty[];
  } catch (error: any) {
    console.error('Error in fetchUserSpecialties:', error);
    toast.error(`Failed to fetch specialties: ${error.message}`);
    return [];
  }
};

export const addSpecialty = async (
  userId: string, 
  specialtyType: string, 
  specialtyName: string
): Promise<Specialty | null> => {
  try {
    console.log('Adding specialty for user:', userId, specialtyType, specialtyName);
    
    const { data, error } = await supabase
      .from('user_specialties')
      .insert({
        user_id: userId,
        specialty_type: specialtyType,
        specialty_name: specialtyName
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error adding specialty:', error);
      toast.error(`Failed to add specialty: ${error.message}`);
      throw error;
    }
    
    console.log('Added specialty:', data);
    return data as Specialty;
  } catch (error: any) {
    console.error('Error in addSpecialty:', error);
    return null;
  }
};

export const removeSpecialty = async (id: string): Promise<void> => {
  try {
    console.log('Removing specialty:', id);
    
    const { error } = await supabase
      .from('user_specialties')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error removing specialty:', error);
      toast.error(`Failed to remove specialty: ${error.message}`);
      throw error;
    }
    
    console.log('Removed specialty');
  } catch (error: any) {
    console.error('Error in removeSpecialty:', error);
  }
};
