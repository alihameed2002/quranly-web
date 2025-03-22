import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsLoading(true);
        // Process the OAuth callback
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
        }
      } catch (err) {
        setError('An unexpected error occurred during authentication.');
        console.error('Auth callback error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [location]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Completing authentication...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="rounded-lg bg-destructive/10 p-4">
          <p className="text-center font-medium text-destructive">
            Authentication error: {error}
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Return to home page
        </button>
      </div>
    );
  }

  // If no errors, redirect to the home page or a previously intended destination
  return <Navigate to="/" replace />;
} 