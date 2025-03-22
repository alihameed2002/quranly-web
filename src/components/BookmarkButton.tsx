import { useState, useEffect } from 'react';
import { BookmarkIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { addBookmark, removeBookmark, checkBookmarkExists } from '@/utils/user-data';
import { toast } from '@/components/ui/use-toast';

interface BookmarkButtonProps {
  contentId: string;
  className?: string;
}

export function BookmarkButton({ contentId, className }: BookmarkButtonProps) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBookmark = async () => {
      if (!user) {
        setIsBookmarked(false);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      const exists = await checkBookmarkExists(contentId);
      setIsBookmarked(exists);
      setIsLoading(false);
    };
    
    checkBookmark();
  }, [contentId, user]);

  const handleBookmarkToggle = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to bookmark content',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    if (isBookmarked) {
      const success = await removeBookmark(contentId);
      if (success) {
        setIsBookmarked(false);
      }
    } else {
      const result = await addBookmark(contentId);
      if (result) {
        setIsBookmarked(true);
      }
    }
    
    setIsLoading(false);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-10 w-10 rounded-full", className)}
      onClick={handleBookmarkToggle}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <BookmarkIcon
          className={cn(
            "h-5 w-5",
            isBookmarked ? "fill-current text-yellow-400" : "text-muted-foreground"
          )}
        />
      )}
    </Button>
  );
} 