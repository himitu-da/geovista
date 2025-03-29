
import { createClient } from '@supabase/supabase-js';

// Check if Supabase environment variables are set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a dummy client if credentials are not available
let supabase;

if (supabaseUrl && supabaseAnonKey) {
  // Initialize real Supabase client with credentials
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a mock Supabase client that returns empty data for development
  console.warn('Supabase credentials not found. Using mock client.');
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
    }),
    // Add other methods as needed
  };
}

export default supabase;
