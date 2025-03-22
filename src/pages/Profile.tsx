import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { Bookmark, Note, Profile as ProfileType } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile(profileData);
        }
        
        // Fetch bookmarks
        const { data: bookmarksData, error: bookmarksError } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (bookmarksError) {
          console.error('Error fetching bookmarks:', bookmarksError);
        } else {
          setBookmarks(bookmarksData);
        }
        
        // Fetch notes
        const { data: notesData, error: notesError } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (notesError) {
          console.error('Error fetching notes:', notesError);
        } else {
          setNotes(notesData);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchUserData();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userInitials = user.user_metadata?.name
    ? user.user_metadata.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : user.email?.substring(0, 2).toUpperCase() || 'U';

  const userDisplayName = user.user_metadata?.name || user.email || 'User';

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center">
        <Avatar className="h-20 w-20 mr-4">
          <AvatarImage src={user.user_metadata?.avatar_url} alt={userDisplayName} />
          <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{userDisplayName}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <Tabs defaultValue="bookmarks">
        <TabsList className="mb-4">
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookmarks">
          <Card>
            <CardHeader>
              <CardTitle>Your Bookmarks</CardTitle>
              <CardDescription>
                Manage your saved bookmarks from the Quran and Sunnah.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookmarks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  You haven't saved any bookmarks yet.
                </p>
              ) : (
                <div className="grid gap-4">
                  {bookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <span>{bookmark.content_id}</span>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Your Notes</CardTitle>
              <CardDescription>
                Access and manage your personal notes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notes.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  You haven't added any notes yet.
                </p>
              ) : (
                <div className="grid gap-4">
                  {notes.map((note) => (
                    <div key={note.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{note.content_id}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(note.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{note.note_text}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>
                Track your reading and learning progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Progress tracking coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 