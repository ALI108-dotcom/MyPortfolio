import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Resolve Supabase configuration
const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://jnnnymecvnfkgazzmzry.supabase.co';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_hzGyOs8g82aBksr_AOGJ5Q_i2uP7tD_';

let client: SupabaseClient | null = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
} catch (err) {
  console.warn('Could not initialize direct Supabase client:', err);
}

export const supabase = client;
export const SUPABASE_PROJECT_URL = supabaseUrl;
