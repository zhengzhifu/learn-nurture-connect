
import { supabase } from '@/integrations/supabase/client';
import { School } from '@/types/auth';
import { toast } from 'sonner';

export const fetchApprovedSchools = async (): Promise<School[]> => {
  try {
    console.log('Fetching approved schools');
    
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('status', 'approved')
      .order('name');
      
    if (error) {
      console.error('Error fetching schools:', error);
      throw error;
    }
    
    console.log('Fetched schools:', data);
    return data as School[];
  } catch (error: any) {
    console.error('Error in fetchApprovedSchools:', error);
    toast.error(`Failed to fetch schools: ${error.message}`);
    return [];
  }
};

export const suggestNewSchool = async (name: string, address?: string): Promise<School | null> => {
  try {
    console.log('Suggesting new school:', name);
    
    const { data, error } = await supabase
      .from('schools')
      .insert({
        name,
        address,
        status: 'pending'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error suggesting new school:', error);
      // If it's a duplicate school name
      if (error.code === '23505') {
        toast.error('A school with this name already exists');
      } else {
        toast.error(`Failed to suggest school: ${error.message}`);
      }
      throw error;
    }
    
    console.log('New school suggested:', data);
    toast.success('Your school suggestion has been submitted for approval');
    return data as School;
  } catch (error: any) {
    console.error('Error in suggestNewSchool:', error);
    return null;
  }
};
