
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface LoginButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  className?: string;
}

export default function LoginButton({ variant = 'default', className }: LoginButtonProps) {
  const { user, signIn, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn();
      // The redirect will happen automatically - no need to do anything here
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast.error("Could not sign in", {
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Could not sign out", {
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

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
