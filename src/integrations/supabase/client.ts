// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ubashdlzeprjkgwcfozf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViYXNoZGx6ZXByamtnd2Nmb3pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNjgyOTgsImV4cCI6MjA1ODg0NDI5OH0.jZ7IjLgZowYyRcdd5lIrOzj_x-7AkVnzvOFAKgCkpr8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);