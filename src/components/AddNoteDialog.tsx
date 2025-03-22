import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { saveNote } from '@/utils/user-data';
import { toast } from '@/components/ui/use-toast';

interface AddNoteDialogProps {
  contentId: string;
  contentTitle?: string;
  buttonClassName?: string;
}

export function AddNoteDialog({ contentId, contentTitle = 'Content', buttonClassName }: AddNoteDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to add notes',
        variant: 'destructive',
      });
      setOpen(false);
      return;
    }

    if (!noteText.trim()) {
      toast({
        title: 'Empty note',
        description: 'Please enter some text for your note',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    const result = await saveNote(contentId, noteText);
    setIsSubmitting(false);

    if (result) {
      toast({
        title: 'Note saved',
        description: 'Your note has been saved successfully',
      });
      setNoteText('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={buttonClassName}
          onClick={() => {
            if (!user) {
              toast({
                title: 'Sign in required',
                description: 'Please sign in to add notes',
                variant: 'destructive',
              });
              return;
            }
            setOpen(true);
          }}
        >
          <Pencil className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
          <DialogDescription>
            Add a personal note for "{contentTitle}". Notes are private and only visible to you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write your note here..."
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Note'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 