
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';

interface LoginButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  className?: string;
}

export default function LoginButton({ variant = 'default', className }: LoginButtonProps) {
  const { user, signIn, logout, loading } = useAuth();

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
        onClick={logout} 
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
      onClick={signIn} 
      variant={variant} 
      className={className}
    >
      <LogIn className="h-4 w-4 mr-2" />
      Sign In with Google
    </Button>
  );
}
