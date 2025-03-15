
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import VerseCard from "./VerseCard";
import { fetchQuranData, fetchSurah, Verse, Surah } from "@/utils/quranData";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const { toast } = useToast();
  const { user, userProgress, updateUserProgress } = useAuth();
  const navigate = useNavigate();
  
  // Initialize with userProgress if available, otherwise use props
  const [currentSurah, setCurrentSurah] = useState(
    userProgress?.lastSurah || initialSurah
  );
  const [currentVerseNumber, setCurrentVerseNumber] = useState(
    userProgress?.lastVerse || initialVerse
  );
  
  const [surahData, setSurahData] = useState<Surah | null>(null);
  const [verseData, setVerseData] = useState<Verse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Set initial state from URL or user progress
  useEffect(() => {
    if (userProgress) {
      setCurrentSurah(userProgress.lastSurah);
      setCurrentVerseNumber(userProgress.lastVerse);
    } else {
      setCurrentSurah(initialSurah);
      setCurrentVerseNumber(initialVerse);
    }
  }, [userProgress, initialSurah, initialVerse]);
  
  // Load verse data when component mounts or when current verse changes
  useEffect(() => {
    const loadVerseData = async () => {
      setIsLoading(true);
      try {
        const { surah, verse } = await fetchQuranData(currentSurah, currentVerseNumber);
        setSurahData(surah);
        setVerseData(verse);
        
        // Save progress whenever verse changes (if user is logged in)
        if (user) {
          const updatedProgress = {
            lastSurah: currentSurah,
            lastVerse: currentVerseNumber,
            completedVerses: userProgress?.completedVerses || {},
            lastReadTimestamp: new Date().getTime()
          };
          
          // Mark verse as completed
          if (!updatedProgress.completedVerses[currentSurah]) {
            updatedProgress.completedVerses[currentSurah] = [];
          }
          
          if (!updatedProgress.completedVerses[currentSurah].includes(currentVerseNumber)) {
            updatedProgress.completedVerses[currentSurah].push(currentVerseNumber);
          }
          
          updateUserProgress(updatedProgress);
          
          // Update URL with current position
          navigate(`/reading?surah=${currentSurah}&verse=${currentVerseNumber}`, { replace: true });
        }
      } catch (error) {
        console.error("Failed to load verse data:", error);
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
  }, [currentSurah, currentVerseNumber, toast, user, userProgress, updateUserProgress, navigate]);
  
  const goToNextVerse = () => {
    if (isLoading || !surahData) return;
    
    if (currentVerseNumber < surahData.numberOfAyahs) {
      // Go to next verse in the same surah
      setCurrentVerseNumber(prev => prev + 1);
    } else if (currentSurah < 114) {
      // Go to first verse of next surah
      setCurrentSurah(prev => prev + 1);
      setCurrentVerseNumber(1);
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
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your progress.",
        variant: "destructive",
      });
      navigate("/settings");
      return;
    }
    
    goToNextVerse();
    
    toast({
      title: "Great job!",
      description: "Your progress has been saved.",
    });
  };
  
  if (isLoading && !verseData) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="h-10 w-10 border-4 border-app-green border-t-transparent rounded-full animate-spin"></div>
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
      
      {user ? (
        <div className="text-center text-sm text-app-text-secondary">
          <p>Your progress is being saved automatically</p>
        </div>
      ) : (
        <div className="text-center text-sm text-app-text-secondary">
          <p>Sign in to save your progress</p>
        </div>
      )}
    </div>
  );
}
