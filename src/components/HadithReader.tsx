
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Hadith } from "@/utils/hadithTypes";
import { useToast } from "@/hooks/use-toast";
import { useProgress } from "@/hooks/useProgress";
import BukhariBookSelector from "./BukhariBookSelector";
import { fetchHadithByNumber, fetchHadithsByBook } from "@/utils/hadithData";

interface HadithReaderProps {
  initialCollection?: string;
  initialBook?: string;
  initialHadith?: string;
  className?: string;
}

export default function HadithReader({
  initialCollection = "bukhari",
  initialBook = "1",
  initialHadith = "1",
  className,
}: HadithReaderProps) {
  const [currentCollection, setCurrentCollection] = useState(initialCollection);
  const [currentBook, setCurrentBook] = useState(initialBook);
  const [currentHadith, setCurrentHadith] = useState(initialHadith);
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [bookHadiths, setBookHadiths] = useState<Hadith[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pointsEarned, setPointsEarned] = useState(5000);
  const navigate = useNavigate();
  const { toast } = useToast();
  const progressContext = useProgress();

  useEffect(() => {
    if (initialCollection) setCurrentCollection(initialCollection);
    if (initialBook) setCurrentBook(initialBook);
    if (initialHadith) setCurrentHadith(initialHadith);
  }, [initialCollection, initialBook, initialHadith]);

  // Load the hadith data
  useEffect(() => {
    const loadHadith = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log(`Loading hadith: Collection=${currentCollection}, Book=${currentBook}, Hadith=${currentHadith}`);
        
        // Load the hadith using the API function
        const loadedHadith = await fetchHadithByNumber(
          currentCollection,
          currentBook,
          currentHadith
        );
        
        // Load all hadiths from this book for navigation
        const hadiths = await fetchHadithsByBook(currentCollection, currentBook);
        
        setHadith(loadedHadith);
        setBookHadiths(hadiths);
        setPointsEarned(Math.floor(Math.random() * 3000) + 3000);

        // Update URL without reloading the page
        navigate(
          `/sunnah/reading?collection=${currentCollection}&book=${currentBook}&hadith=${currentHadith}`,
          { replace: true }
        );
      } catch (err) {
        console.error("Error loading hadith:", err);
        setError("Failed to load hadith. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load hadith data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadHadith();
  }, [currentCollection, currentBook, currentHadith, navigate, toast]);

  const goToNextHadith = () => {
    if (isLoading || !hadith) return;

    // Find current index
    const currentIndex = bookHadiths.findIndex(
      (h) => h.hadithNumber === currentHadith
    );
    
    if (currentIndex < bookHadiths.length - 1) {
      // Go to next hadith in current book
      const nextHadith = bookHadiths[currentIndex + 1];
      setCurrentHadith(nextHadith.hadithNumber);
    } else {
      // If we're at the last hadith of the book, try to go to the next book
      const nextBookId = (parseInt(currentBook) + 1).toString();
      setCurrentBook(nextBookId);
      setCurrentHadith("1"); // Start from the first hadith in the next book
    }
    
    // Mark hadith as read if progress tracking is available
    markHadithAsRead();
  };

  const goToPrevHadith = () => {
    if (isLoading || !hadith) return;

    // Find current index
    const currentIndex = bookHadiths.findIndex(
      (h) => h.hadithNumber === currentHadith
    );
    
    if (currentIndex > 0) {
      // Go to previous hadith in current book
      const prevHadith = bookHadiths[currentIndex - 1];
      setCurrentHadith(prevHadith.hadithNumber);
    } else if (parseInt(currentBook) > 1) {
      // If we're at the first hadith of the book, try to go to the previous book
      const prevBookId = (parseInt(currentBook) - 1).toString();
      setCurrentBook(prevBookId);
      // Will default to first hadith, ideally we'd load the last hadith of prev book
      setCurrentHadith("1"); 
    }
  };
  
  const handleSelectBook = (bookId: string) => {
    if (bookId !== currentBook) {
      setCurrentBook(bookId);
      setCurrentHadith("1"); // Reset to first hadith when changing books
    }
  };
  
  const handleSelectHadith = (hadithNumber: string) => {
    setCurrentHadith(hadithNumber);
  };
  
  const markHadithAsRead = () => {
    // Since we don't have direct access to markHadithAsRead, we'll just show a toast
    toast({
      title: "Great job!",
      description: `You've earned ${pointsEarned} points for reading this hadith.`,
    });
  };

  const handleDone = () => {
    markHadithAsRead();
  };

  if (isLoading) {
    return (
      <div className="w-full p-6 flex justify-center items-center h-64">
        <div className="h-10 w-10 border-4 border-app-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !hadith) {
    return (
      <div className="w-full p-6 flex flex-col items-center justify-center h-64">
        <div className="text-app-text-secondary mb-4">
          {error || "Failed to load hadith data"}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-app-green text-app-background-dark rounded-full"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-6 pb-24", className)}>
      <div className="px-6 flex items-center justify-between">
        <BukhariBookSelector
          currentBook={currentBook}
          currentHadith={currentHadith}
          onSelectBook={handleSelectBook}
          onSelectHadith={handleSelectHadith}
        />
      </div>

      {/* Hadith Content */}
      <div className="glass-card mx-6 p-6 rounded-lg space-y-6">
        {hadith.arabic && (
          <div className="text-right">
            <p className="text-xl leading-loose text-white font-arabic">
              {hadith.arabic}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">
            {hadith.reference}
          </h3>
          
          {hadith.narrator && (
            <p className="text-app-green font-medium">
              Narrated {hadith.narrator}
            </p>
          )}
          
          <p className="text-white leading-relaxed">{hadith.english}</p>
          
          {hadith.grade && (
            <div className="pt-2">
              <span className="text-sm text-app-text-secondary">
                Grade: <span className="text-app-green">{hadith.grade}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation controls */}
      <div className="w-full flex items-center justify-between px-6">
        <button 
          onClick={goToPrevHadith}
          disabled={isLoading || (currentBook === "1" && currentHadith === "1")}
          className={cn(
            "h-14 w-32 rounded-full flex items-center justify-center glass-card transition-all duration-300",
            !isLoading ? "hover:bg-white/10 active:scale-95" : "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-6 w-6 text-white mr-2" />
          <span className="text-white font-medium">Previous</span>
        </button>
        
        <button 
          onClick={handleDone}
          className="h-14 w-32 rounded-full flex items-center justify-center bg-app-green text-app-background-dark font-medium hover:bg-app-green-light transition-all duration-300 active:scale-95"
        >
          I'm Done
        </button>
        
        <button 
          onClick={goToNextHadith}
          disabled={isLoading}
          className={cn(
            "h-14 w-32 rounded-full flex items-center justify-center glass-card transition-all duration-300",
            !isLoading ? "hover:bg-white/10 active:scale-95" : "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="text-white font-medium">Next</span>
          <ChevronRight className="h-6 w-6 text-white ml-2" />
        </button>
      </div>
      
      <div className="text-center text-sm text-app-text-secondary">
        <div className="font-medium text-app-green">+{pointsEarned}</div>
        <p>Points earned for this hadith</p>
      </div>
    </div>
  );
}
