import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  error: AuthError | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Check for active session on initial load
    const getSession = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setError(error);
        toast({
          title: 'Error',
          description: 'Failed to get authentication session',
          variant: 'destructive',
        });
      } else {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
      
      setIsLoading(false);
    };
    
    getSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth event: ${event}`);
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (event === 'SIGNED_IN') {
        toast({
          title: 'Signed in successfully',
          description: `Welcome${session?.user?.user_metadata?.name ? ', ' + session.user.user_metadata.name : ''}!`,
        });
      }
      
      if (event === 'SIGNED_OUT') {
        toast({
          title: 'Signed out',
          description: 'You have been signed out',
        });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        setError(error);
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (e) {
      const err = e as AuthError;
      setError(err);
      toast({
        title: 'Sign in failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error);
        toast({
          title: 'Sign out failed',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (e) {
      const err = e as AuthError;
      setError(err);
      toast({
        title: 'Sign out failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signInWithGoogle,
    signOut,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 