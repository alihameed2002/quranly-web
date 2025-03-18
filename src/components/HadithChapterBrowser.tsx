
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Book, ChevronRight, Loader2 } from "lucide-react";
import { getHadithChapters, getHadithsByChapter } from "@/utils/hadithData";
import { cn } from "@/lib/utils";
import { Hadith } from "@/utils/hadithTypes";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

interface HadithChapterBrowserProps {
  className?: string;
}

export default function HadithChapterBrowser({ className }: HadithChapterBrowserProps) {
  const [chapters, setChapters] = useState<{id: number, name: string, hadithCount: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
  const [chapterHadiths, setChapterHadiths] = useState<{ [key: number]: Hadith[] }>({});
  const [loadingChapter, setLoadingChapter] = useState<number | null>(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadChapters = async () => {
      try {
        setLoading(true);
        const hadithChapters = await getHadithChapters();
        setChapters(hadithChapters);
      } catch (error) {
        console.error("Failed to load hadith chapters:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadChapters();
  }, []);
  
  const handleExpandChapter = async (chapterId: number) => {
    // Toggle expansion
    if (expandedChapter === chapterId) {
      setExpandedChapter(null);
      return;
    }
    
    setExpandedChapter(chapterId);
    
    // Load chapter hadiths if they haven't been loaded yet
    if (!chapterHadiths[chapterId]) {
      setLoadingChapter(chapterId);
      try {
        const hadiths = await getHadithsByChapter(chapterId);
        setChapterHadiths(prev => ({
          ...prev,
          [chapterId]: hadiths
        }));
      } catch (error) {
        console.error(`Failed to load hadiths for chapter ${chapterId}:`, error);
      } finally {
        setLoadingChapter(null);
      }
    }
  };
  
  const navigateToHadith = (hadith: Hadith) => {
    navigate(`/sunnah/reading?collection=${encodeURIComponent(hadith.collection)}&book=${hadith.bookNumber}&hadith=${hadith.hadithNumber}`);
  };
  
  if (loading) {
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
        Browse Sahih Bukhari by Book
      </h2>
      
      <Accordion
        type="single"
        collapsible
        className="space-y-2"
        value={expandedChapter ? expandedChapter.toString() : undefined}
        onValueChange={(value) => handleExpandChapter(Number(value))}
      >
        {chapters.map(chapter => (
          <AccordionItem 
            key={chapter.id} 
            value={chapter.id.toString()}
            className="glass-card rounded-lg overflow-hidden border-none"
          >
            <AccordionTrigger className="px-4 py-3 hover:bg-white/5 transition-colors">
              <div className="flex items-center space-x-3 text-left">
                <div className="h-10 w-10 rounded-md bg-app-green/20 flex items-center justify-center">
                  <Book className="h-5 w-5 text-app-green" />
                </div>
                <div>
                  <div className="text-white font-medium">{chapter.name}</div>
                  <div className="text-app-text-secondary text-sm">{chapter.hadithCount} hadith{chapter.hadithCount !== 1 ? 's' : ''}</div>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="px-4 pb-4">
              {loadingChapter === chapter.id ? (
                <div className="py-6 flex justify-center">
                  <Loader2 className="h-6 w-6 text-app-green animate-spin" />
                </div>
              ) : (
                <div className="space-y-2 mt-2">
                  {chapterHadiths[chapter.id]?.map((hadith, index) => (
                    <div 
                      key={`${hadith.collection}-${hadith.bookNumber}-${hadith.hadithNumber}`}
                      className="p-3 rounded-md hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-between"
                      onClick={() => navigateToHadith(hadith)}
                    >
                      <div>
                        <div className="text-sm text-white">Hadith #{hadith.hadithNumber}</div>
                        <div className="text-xs text-app-text-secondary truncate max-w-[250px]">
                          {hadith.english.substring(0, 60)}...
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-app-text-secondary" />
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      {chapters.length === 0 && !loading && (
        <div className="text-center text-app-text-secondary py-8">
          No chapters found. Please try refreshing the page.
        </div>
      )}
    </div>
  );
}
