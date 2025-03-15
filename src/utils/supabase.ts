import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Get environment variables with proper error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials exist and log error but don't crash
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing! Authentication will not work.');
}

// Create the Supabase client - we'll handle missing credentials in the auth functions
export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);

// User progress interface
export interface UserProgress {
  lastSurah: number;
  lastVerse: number;
  completedVerses: { [surahId: string]: number[] };
  lastReadTimestamp: number;
}

// Save user progress
export const saveUserProgress = async (userId: string, progress: UserProgress) => {
  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert({ 
        user_id: userId, 
        progress,
        last_updated: new Date().toISOString() 
      }, {
        onConflict: 'user_id'
      });
      
    if (error) throw error;
  } catch (error) {
    console.error("Error saving user progress:", error);
    throw error;
  }
};

// Get user progress
export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('progress')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    return data?.progress as UserProgress || null;
  } catch (error) {
    console.error("Error getting user progress:", error);
    return null;
  }
};

// Improved Google auth with better error handling
export const signInWithGoogle = async () => {
  try {
    // Check for credentials before attempting sign-in
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase credentials are missing. Please check your environment variables.');
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/settings`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    toast.error("Failed to sign in with Google", {
      description: error.message || "Check your Supabase configuration."
    });
    throw error;
  }
};

// Improved signOut helper function
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    console.error("Error signing out:", error);
    toast.error("Failed to sign out", {
      description: error.message || "Please try again."
    });
    throw error;
  }
};
