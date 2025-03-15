
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface LoginButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  className?: string;
}

export default function LoginButton({ variant = 'default', className }: LoginButtonProps) {
  const { user, signIn, logout, loading } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error: any) {
      console.error("Error signing in:", error);
      
      // Provide a friendly error message
      toast.error("Could not sign in. Please try again later.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Could not sign out. Please try again later.");
    }
  };

  if (loading) {
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
