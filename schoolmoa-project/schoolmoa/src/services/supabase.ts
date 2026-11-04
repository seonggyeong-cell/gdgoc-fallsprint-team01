// src/services/supabase.ts [공유]
import { createClient } from '@supabase/supabase-js';
import { ENV } from '@/config/constants';

export const supabase = createClient(
  ENV.supabaseUrl || 'https://placeholder.supabase.co',
  ENV.supabaseKey || 'placeholder-anon-key'
);

