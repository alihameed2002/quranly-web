import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import VerseCard from "./VerseCard";
import { fetchQuranData, fetchSurah, Verse, Surah } from "@/utils/quranData";
import { useProgress } from "@/hooks/useProgress";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface QuranReaderProps {
  className?: string;
  initialSurah?: number;
  initialVerse?: number;
}

export default function QuranReader({ 
  className,
  initialSurah = 7, // Default to Al-Araf
  initialVerse = 128 // Default to the sample verse
}: QuranReaderProps) {
  const { markVerseAsRead } = useProgress();
  const { toast } = useToast();
  const [currentSurah, setCurrentSurah] = useState(initialSurah);
  const [currentVerseNumber, setCurrentVerseNumber] = useState(initialVerse);
  const [surahData, setSurahData] = useState<Surah | null>(null);
  const [verseData, setVerseData] = useState<Verse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pointsEarned, setPointsEarned] = useState(7600);
  const [error, setError] = useState<string | null>(null);
  
  // Load verse data when component mounts or when current verse changes
  useEffect(() => {
    const loadVerseData = async () => {
      // Input validation - ensure we're working with valid numbers
      const validSurah = Number(currentSurah);
      const validVerse = Number(currentVerseNumber);
      
      if (isNaN(validSurah) || isNaN(validVerse) || validSurah < 1 || validSurah > 114 || validVerse < 1) {
        console.error(`Invalid surah or verse requested: surah=${currentSurah}, verse=${currentVerseNumber}`);
        setError("Invalid surah or verse number requested");
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Invalid surah or verse number",
          variant: "destructive",
        });
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      console.log(`Loading verse data for surah ${validSurah}, verse ${validVerse}`);
      
      try {
        const { surah, verse } = await fetchQuranData(validSurah, validVerse);
        
        // Additional validation to ensure we got the right verse
        if (verse.surah !== validSurah || verse.ayah !== validVerse) {
          console.warn(`Received incorrect verse: got surah ${verse.surah}, ayah ${verse.ayah} but requested surah ${validSurah}, ayah ${validVerse}`);
          
          // If we got a sample verse instead of the right one, show an error
          if (verse.surah === 7 && verse.ayah === 128 && (validSurah !== 7 || validVerse !== 128)) {
            throw new Error("Could not load the requested verse.");
          }
        }
        
        setSurahData(surah);
        setVerseData(verse);
        setPointsEarned(Math.floor(Math.random() * 5000) + 5000); // Random points for demo
      } catch (error) {
        console.error("Failed to load verse data:", error);
        setError("Failed to load the Quran data. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load the Quran data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVerseData();
  }, [currentSurah, currentVerseNumber, toast]);
  
  // Update when props change
  useEffect(() => {
    console.log(`Props updated: initialSurah=${initialSurah}, initialVerse=${initialVerse}`);
    
    // Only update if we have valid numbers
    const validSurah = Number(initialSurah);
    const validVerse = Number(initialVerse);
    
    if (!isNaN(validSurah) && !isNaN(validVerse) && validSurah > 0 && validVerse > 0) {
      setCurrentSurah(validSurah);
      setCurrentVerseNumber(validVerse);
    } else {
      console.warn(`Received invalid initialSurah=${initialSurah} or initialVerse=${initialVerse}, using defaults`);
    }
  }, [initialSurah, initialVerse]);
  
  const goToNextVerse = () => {
    if (isLoading || !surahData) return;
    
    if (currentVerseNumber < surahData.numberOfAyahs) {
      // Go to next verse in the same surah
      setCurrentVerseNumber(prev => prev + 1);
      markVerseAsRead(currentSurah, currentVerseNumber);
    } else if (currentSurah < 114) {
      // Go to first verse of next surah
      setCurrentSurah(prev => prev + 1);
      setCurrentVerseNumber(1);
      markVerseAsRead(currentSurah, currentVerseNumber);
    } else {
      // End of Quran
      toast({
        title: "End of Quran",
        description: "You have reached the end of the Quran.",
      });
    }
  };
  
  const goToPrevVerse = () => {
    if (isLoading || (currentVerseNumber <= 1 && currentSurah <= 1)) return;
    
    if (currentVerseNumber > 1) {
      // Go to previous verse in the same surah
      setCurrentVerseNumber(prev => prev - 1);
    } else if (currentSurah > 1) {
      // Need to fetch the previous surah to know its number of verses
      fetchSurah(currentSurah - 1).then(prevSurah => {
        setCurrentSurah(prev => prev - 1);
        setCurrentVerseNumber(prevSurah.numberOfAyahs);
      });
    }
  };

  const handleDone = () => {
    markVerseAsRead(currentSurah, currentVerseNumber);
    toast({
      title: "Great job!",
      description: `You've earned ${pointsEarned} points for this verse.`,
    });
  };
  
  if (isLoading && !verseData) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="h-10 w-10 border-4 border-app-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error && !verseData) {
    return (
      <div className="w-full flex flex-col justify-center items-center h-64 text-center px-4">
        <div className="text-app-text-secondary mb-4">
          Could not load the requested verse. The verse may not exist or there might be an issue with the data source.
        </div>
        <button 
          onClick={() => window.location.href = '/reading'}
          className="px-4 py-2 bg-app-green text-app-background-dark rounded-full"
        >
          Go to default verse
        </button>
      </div>
    );
  }
  
  return (
    <div className={cn("w-full space-y-6 pb-24", className)}>
      {verseData && surahData && (
        <VerseCard 
          surahName={surahData.englishName}
          surahNumber={surahData.id}
          verseNumber={verseData.ayah}
          totalVerses={surahData.numberOfAyahs}
          arabicText={verseData.arabic}
          translation={verseData.translation}
        />
      )}
      
      <div className="w-full flex items-center justify-between px-6">
        <button 
          onClick={goToPrevVerse}
          disabled={isLoading || (currentVerseNumber <= 1 && currentSurah <= 1)}
          className={cn(
            "h-14 w-32 rounded-full flex items-center justify-center glass-card transition-all duration-300",
            !isLoading && !(currentVerseNumber <= 1 && currentSurah <= 1) ? "hover:bg-white/10 active:scale-95" : "opacity-50 cursor-not-allowed"
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
          onClick={goToNextVerse}
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
        <p>Points earned for this verse</p>
      </div>
    </div>
  );
}
