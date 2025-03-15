
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  supabase, 
  UserProgress, 
  getUserProgress, 
  saveUserProgress,
  signInWithGoogle,
  signOut
} from '@/utils/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  userProgress: UserProgress | null;
  updateUserProgress: (progress: UserProgress) => Promise<void>;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Check for Supabase credentials
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials missing:', { supabaseUrl, supabaseKey });
      setAuthError('Supabase credentials are missing. Authentication will not work.');
    }

    // Check if there's an active session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          throw error;
        }
        
        setUser(session?.user || null);
        
        if (session?.user) {
          try {
            const progress = await getUserProgress(session.user.id);
            setUserProgress(progress);
          } catch (progressError) {
            console.error("Error fetching user progress:", progressError);
          }
        }
      } catch (error: any) {
        console.error("Error retrieving session:", error);
        setAuthError(error.message || 'Failed to get authentication session');
      } finally {
        setLoading(false);
      }
    };
    
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setUser(session?.user || null);
        
        if (session?.user) {
          // Fetch user progress when user is authenticated
          try {
            const progress = await getUserProgress(session.user.id);
            if (progress) {
              setUserProgress(progress);
            }
          } catch (error) {
            console.error("Error fetching user progress:", error);
          }
        } else {
          setUserProgress(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    // Verify Supabase credentials exist
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      const errorMsg = 'Supabase credentials are missing. Authentication will not work.';
      setAuthError(errorMsg);
      toast.error("Authentication Error", { description: errorMsg });
      throw new Error(errorMsg);
    }
    
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast.error("Sign in failed", {
        description: error.message || "Please check your Supabase configuration."
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut();
      setUser(null);
      setUserProgress(null);
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error("Sign out failed", {
        description: error.message || "Please try again later."
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProgress = async (progress: UserProgress) => {
    if (!user) return;
    
    try {
      await saveUserProgress(user.id, progress);
      setUserProgress(progress);
    } catch (error: any) {
      console.error("Error updating progress:", error);
      toast.error("Error saving progress", {
        description: "Your reading progress couldn't be saved."
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        signIn, 
        logout, 
        userProgress, 
        updateUserProgress,
        authError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
