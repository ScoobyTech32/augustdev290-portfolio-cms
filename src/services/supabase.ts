import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

const getClient = (): SupabaseClient => {
  if (_supabase) return _supabase;
  
  const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
  const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // We throw a more descriptive error only when the client is actually accessed
    throw new Error('Supabase configuration missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
  }
  
  _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
};

// Export a proxy that initializes the client on first access
export const supabase = new Proxy({} as SupabaseClient, {
  get: (_target, prop) => {
    const client = getClient();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
});
