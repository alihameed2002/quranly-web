import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { getBooks, getHadithsByBook, COLLECTION_MAP } from "@/utils/hadithDatabase";
import { cn } from "@/lib/utils";
import { Hadith } from "@/utils/hadithTypes";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface HadithChapterBrowserProps {
  className?: string;
  collectionId?: string;
  onHadithClick?: (hadith: Hadith) => void;
  isLoading?: boolean;
}

// Book interface to match what's returned by hadithDatabase's getBooks
interface Book {
  bookNumber: string;
  bookName: string;
  hadithCount: number;
}

export default function HadithChapterBrowser({ 
  className,
  collectionId = "bukhari",
  onHadithClick,
  isLoading: externalLoading = false
}: HadithChapterBrowserProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [bookHadiths, setBookHadiths] = useState<{ [key: string]: Hadith[] }>({});
  const [loadingBook, setLoadingBook] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const booksList = await getBooks(collectionId);
        setBooks(booksList);
      } catch (error) {
        console.error("Failed to load hadith books:", error);
        toast({
          title: "Error",
          description: "Failed to load hadith books",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadBooks();
  }, [collectionId, toast]);
  
  const handleExpandBook = async (bookId: string) => {
    // Toggle expansion
    if (expandedBook === bookId) {
      setExpandedBook(null);
      return;
    }
    
    setExpandedBook(bookId);
    
    // Load book hadiths if they haven't been loaded yet
    if (!bookHadiths[bookId]) {
      setLoadingBook(bookId);
      try {
        const hadiths = await getHadithsByBook(collectionId, bookId);
        setBookHadiths(prev => ({
          ...prev,
          [bookId]: hadiths
        }));
      } catch (error) {
        console.error(`Failed to load hadiths for book ${bookId}:`, error);
        toast({
          title: "Error",
          description: `Failed to load hadiths for book ${bookId}`,
          variant: "destructive",
        });
      } finally {
        setLoadingBook(null);
      }
    }
  };
  
  const handleHadithClick = (hadith: Hadith) => {
    if (onHadithClick) {
      onHadithClick(hadith);
    } else {
      navigate(`/sunnah/reading?collection=${encodeURIComponent(hadith.collection)}&book=${hadith.bookNumber}&hadith=${hadith.hadithNumber}`);
    }
  };
  
  if (loading || externalLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass-card rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-md bg-white/10" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 bg-white/10" />
                <Skeleton className="h-3 w-20 bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-lg font-medium text-white mb-4">
        Browse {COLLECTION_MAP[collectionId]} Books
      </h2>
      
      {books.length === 0 && !loading ? (
        <div className="glass-card rounded-lg p-8 text-center">
          <p className="text-app-text-secondary">
            No books available for this collection.
          </p>
          <p className="text-app-text-secondary mt-2">
            Please try another collection.
          </p>
        </div>
      ) : (
        <Accordion
          type="single"
          collapsible
          className="space-y-2"
          value={expandedBook || undefined}
          onValueChange={handleExpandBook}
        >
          {books.map(book => (
            <AccordionItem 
              key={book.bookNumber} 
              value={book.bookNumber}
              className="glass-card rounded-lg overflow-hidden border-none"
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-3 text-left">
                  <div className="h-10 w-10 rounded-md bg-app-green/20 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-app-green" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{book.bookName}</div>
                    <div className="text-app-text-secondary text-sm">{book.hadithCount} hadith{book.hadithCount !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-4 pb-4">
                {loadingBook === book.bookNumber ? (
                  <div className="py-6 flex justify-center">
                    <Loader2 className="h-6 w-6 text-app-green animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2 mt-2">
                    {bookHadiths[book.bookNumber]?.length > 0 ? (
                      bookHadiths[book.bookNumber].map((hadith, index) => (
                        <div 
                          key={`${hadith.collection}-${hadith.bookNumber}-${hadith.hadithNumber}`}
                          className="p-3 rounded-md hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-between"
                          onClick={() => handleHadithClick(hadith)}
                        >
                          <div>
                            <div className="text-sm text-white">Hadith #{hadith.hadithNumber}</div>
                            <div className="text-xs text-app-text-secondary truncate max-w-[250px]">
                              {hadith.english.substring(0, 60)}...
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-app-text-secondary" />
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-app-text-secondary py-4">
                        No hadiths available for this book
                      </div>
                    )}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
