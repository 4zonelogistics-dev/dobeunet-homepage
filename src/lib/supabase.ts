import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Lead {
  id?: string;
  name: string;
  email: string;
  company: string;
  business_type: string;
  phone: string;
  message: string;
  submission_type: 'strategy' | 'pilot';
  created_at?: string;
}

export async function submitLead(lead: Omit<Lead, 'id' | 'created_at'>): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('leads')
      .insert([lead]);

    if (error) {
      console.error('Error submitting lead:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error submitting lead:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
