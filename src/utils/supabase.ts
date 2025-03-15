
import { createClient } from '@supabase/supabase-js';

// Update to use environment variables or default values that won't break the app
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fake-url-for-testing.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'fake-key-for-testing';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// Add a helper function to handle Google auth
export const signInWithGoogle = async () => {
  try {
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
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Add a signOut helper function
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
