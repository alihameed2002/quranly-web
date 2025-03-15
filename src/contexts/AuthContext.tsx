
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, signInWithGoogle, signOut, UserProgress, getUserProgress, saveUserProgress } from '@/utils/firebase';
import { useToast } from '@/hooks/use-toast';
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
  const { toast: uiToast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        // Fetch user progress
        try {
          const progress = await getUserProgress(authUser.uid);
          if (progress) {
            setUserProgress(progress);
          }
        } catch (error) {
          console.error("Error fetching user progress:", error);
        }
      } else {
        setUserProgress(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      toast("Welcome!", {
        description: "You've successfully signed in."
      });
    } catch (error) {
      console.error("Error signing in:", error);
      toast("Error signing in", {
        description: "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut();
      toast("Signed out", {
        description: "You've been successfully signed out."
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast("Error signing out", {
        description: "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserProgress = async (progress: UserProgress) => {
    if (!user) return;
    
    try {
      await saveUserProgress(user.uid, progress);
      setUserProgress(progress);
    } catch (error) {
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
