import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

// User progress functions
export async function saveUserProgress(moduleId: string, progressValue: number, completed = false) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    toast({
      title: 'Error',
      description: 'You must be logged in to save progress',
      variant: 'destructive',
    });
    return null;
  }
  
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userData.user.id,
      module_id: moduleId,
      progress: progressValue,
      completed: completed,
      last_accessed: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { 
      onConflict: 'user_id,module_id' 
    });
  
  if (error) {
    console.error('Error saving progress:', error);
    toast({
      title: 'Error',
      description: 'Failed to save progress',
      variant: 'destructive',
    });
    return null;
  }
  
  return data;
}

export async function getUserProgress(moduleId: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userData.user.id)
    .eq('module_id', moduleId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error code
    console.error('Error fetching progress:', error);
    return null;
  }
  
  return data;
}

// Bookmark functions
export async function addBookmark(contentId: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    toast({
      title: 'Error',
      description: 'You must be logged in to add a bookmark',
      variant: 'destructive',
    });
    return null;
  }
  
  const { data, error } = await supabase
    .from('bookmarks')
    .insert([{ 
      user_id: userData.user.id, 
      content_id: contentId 
    }]);
  
  if (error) {
    // Check if it's a duplicate bookmark error
    if (error.code === '23505') {
      toast({
        title: 'Bookmark exists',
        description: 'This bookmark already exists',
      });
      return null;
    }
    
    console.error('Error adding bookmark:', error);
    toast({
      title: 'Error',
      description: 'Failed to add bookmark',
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Bookmark added',
    description: 'Successfully added bookmark',
  });
  
  return data;
}

export async function removeBookmark(contentId: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    toast({
      title: 'Error',
      description: 'You must be logged in to remove a bookmark',
      variant: 'destructive',
    });
    return false;
  }
  
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userData.user.id)
    .eq('content_id', contentId);
  
  if (error) {
    console.error('Error removing bookmark:', error);
    toast({
      title: 'Error',
      description: 'Failed to remove bookmark',
      variant: 'destructive',
    });
    return false;
  }
  
  toast({
    title: 'Bookmark removed',
    description: 'Successfully removed bookmark',
  });
  
  return true;
}

export async function getUserBookmarks() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }
  
  return data;
}

export async function checkBookmarkExists(contentId: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return false;
  }
  
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userData.user.id)
    .eq('content_id', contentId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error checking bookmark:', error);
    return false;
  }
  
  return !!data;
}

// Note functions
export async function saveNote(contentId: string, noteText: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    toast({
      title: 'Error',
      description: 'You must be logged in to save a note',
      variant: 'destructive',
    });
    return null;
  }
  
  const { data, error } = await supabase
    .from('notes')
    .insert([{
      user_id: userData.user.id,
      content_id: contentId,
      note_text: noteText,
    }]);
  
  if (error) {
    console.error('Error saving note:', error);
    toast({
      title: 'Error',
      description: 'Failed to save note',
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Note saved',
    description: 'Successfully saved note',
  });
  
  return data;
}

export async function updateNote(noteId: string, noteText: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    toast({
      title: 'Error',
      description: 'You must be logged in to update a note',
      variant: 'destructive',
    });
    return null;
  }
  
  const { data, error } = await supabase
    .from('notes')
    .update({ 
      note_text: noteText,
      updated_at: new Date().toISOString()
    })
    .eq('id', noteId)
    .eq('user_id', userData.user.id);
  
  if (error) {
    console.error('Error updating note:', error);
    toast({
      title: 'Error',
      description: 'Failed to update note',
      variant: 'destructive',
    });
    return null;
  }
  
  toast({
    title: 'Note updated',
    description: 'Successfully updated note',
  });
  
  return data;
}

export async function deleteNote(noteId: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    toast({
      title: 'Error',
      description: 'You must be logged in to delete a note',
      variant: 'destructive',
    });
    return false;
  }
  
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)
    .eq('user_id', userData.user.id);
  
  if (error) {
    console.error('Error deleting note:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete note',
      variant: 'destructive',
    });
    return false;
  }
  
  toast({
    title: 'Note deleted',
    description: 'Successfully deleted note',
  });
  
  return true;
}

export async function getNotesForContent(contentId: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userData.user.id)
    .eq('content_id', contentId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
  
  return data;
} 