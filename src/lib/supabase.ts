import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ntunvgoaspiioenqizxx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dW52Z29hc3BpaW9lbnFpenh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MDEzOTQsImV4cCI6MjA1ODE3NzM5NH0.cfpDxYC4LAALzrjqb0OPsuHRthS2mb2j9-uCu6JC0Es';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for user data
export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  module_id: string;
  progress: number;
  completed: boolean;
  last_accessed: string;
  created_at: string;
  updated_at: string;
};

export type Bookmark = {
  id: string;
  user_id: string;
  content_id: string;
  created_at: string;
};

export type Note = {
  id: string;
  user_id: string;
  content_id: string;
  note_text: string;
  created_at: string;
  updated_at: string;
}; 