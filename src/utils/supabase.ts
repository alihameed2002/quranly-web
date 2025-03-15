
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-project-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

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
