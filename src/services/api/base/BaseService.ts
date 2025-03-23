
import { supabase } from '@/integrations/supabase/client';

export class BaseService {
  protected supabase = supabase;
  
  constructor() {
    console.log(`${this.constructor.name} initialized`);
  }
}
