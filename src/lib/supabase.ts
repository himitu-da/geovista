
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Initialize Supabase client - these will need to be updated with actual values once connected
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase;

try {
  // Only create the client if we have the required values
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    // Create a mock client that will notify about missing credentials
    supabase = {
      from: () => {
        console.warn('Supabase credentials not configured. Using mock data.');
        return {
          select: () => Promise.resolve({ 
            data: [], 
            error: new Error('Supabase credentials not configured') 
          })
        };
      }
    };
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Create a fallback mock client
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ 
        data: [], 
        error: new Error('Failed to initialize Supabase client') 
      })
    })
  };
}

export default supabase;
