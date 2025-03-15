
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

interface LoginButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  className?: string;
}

export default function LoginButton({ variant = 'default', className }: LoginButtonProps) {
  const { user, signIn, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check for Supabase credentials on mount
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      setAuthError('Supabase credentials missing. Authentication will not work.');
      console.error('Supabase credentials missing:', { supabaseUrl, supabaseKey });
    } else {
      setAuthError(null);
    }
  }, []);

  const handleSignIn = async () => {
    // Check for credentials first
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      toast.error("Authentication configuration missing", {
        description: "Please check Supabase configuration."
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await signIn();
      // The redirect will happen automatically
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast.error("Could not sign in", {
        description: error.message || "Please check your Supabase configuration."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      toast.success("Signed out successfully");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error("Could not sign out", {
        description: error.message || "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Display an error if Supabase credentials are missing
  if (authError) {
    return (
      <Button variant="destructive" className={className} disabled>
        <AlertCircle className="h-4 w-4 mr-2" />
        Config Error
      </Button>
    );
  }

  if (isLoading) {
    return (
      <Button variant={variant} className={className} disabled>
        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        Loading...
      </Button>
    );
  }
  
  if (user) {
    return (
      <Button 
        onClick={handleLogout} 
        variant="outline" 
        className={className}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleSignIn} 
      variant={variant} 
      className={className}
    >
      <LogIn className="h-4 w-4 mr-2" />
      Sign In with Google
    </Button>
  );
}
