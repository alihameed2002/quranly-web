
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, UserProgress, getUserProgress, saveUserProgress } from '@/utils/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  userProgress: UserProgress | null;
  updateUserProgress: (progress: UserProgress) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up session listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);

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

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
      
      if (session?.user) {
        getUserProgress(session.user.id).then(progress => {
          if (progress) {
            setUserProgress(progress);
          }
        }).catch(error => {
          console.error("Error fetching initial user progress:", error);
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/settings'
        }
      });
      
      if (error) throw error;
      
      toast("Redirecting to Google...", {
        description: "You'll be redirected to sign in with Google."
      });
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast("Error signing in", {
        description: error.message || "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setUserProgress(null);
      toast("Signed out", {
        description: "You've been successfully signed out."
      });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast("Error signing out", {
        description: error.message || "Please try again later."
      });
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
      toast("Error saving progress", {
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
        updateUserProgress 
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
