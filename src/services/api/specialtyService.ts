
import { supabase } from '@/integrations/supabase/client';
import { Specialty } from '@/types/auth';
import { toast } from 'sonner';

// Fetch all specialties for a user
export const fetchUserSpecialties = async (userId: string): Promise<Specialty[]> => {
  try {
    const { data, error } = await supabase
      .from('specialties')
      .select('*')
      .eq('tutor_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching specialties:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Exception fetching specialties:', error);
    return [];
  }
};

// Add a new specialty
export const addSpecialty = async (
  userId: string,
  specialtyType: string,
  specialtyName: string
): Promise<Specialty | null> => {
  try {
    // Check if this specialty already exists for this user
    const { data: existingSpecialties, error: checkError } = await supabase
      .from('specialties')
      .select('*')
      .eq('tutor_id', userId)
      .eq('specialty_type', specialtyType)
      .eq('specialty_name', specialtyName);
      
    if (checkError) {
      console.error('Error checking existing specialty:', checkError);
      toast.error('Failed to check existing specialties');
      return null;
    }
    
    if (existingSpecialties && existingSpecialties.length > 0) {
      toast.error('You already have this specialty added');
      return null;
    }
    
    // Add the new specialty
    const { data, error } = await supabase
      .from('specialties')
      .insert({
        tutor_id: userId,
        specialty_type: specialtyType,
        specialty_name: specialtyName
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding specialty:', error);
      toast.error('Failed to add specialty');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception adding specialty:', error);
    toast.error('Failed to add specialty');
    return null;
  }
};

// Remove a specialty
export const removeSpecialty = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('specialties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing specialty:', error);
      toast.error('Failed to remove specialty');
    }
  } catch (error) {
    console.error('Exception removing specialty:', error);
    toast.error('Failed to remove specialty');
  }
};
