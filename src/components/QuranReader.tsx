
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import VerseCard from "./VerseCard";
import { sampleVerse, sampleSurah } from "@/utils/quranData";
import { useProgress } from "@/hooks/useProgress";
import { useState } from "react";

interface QuranReaderProps {
  className?: string;
}

export default function QuranReader({ className }: QuranReaderProps) {
  const { markVerseAsRead } = useProgress();
  const [verse, setVerse] = useState(sampleVerse);
  const [currentVerseNumber, setCurrentVerseNumber] = useState(sampleVerse.ayah);
  const [isLoading, setIsLoading] = useState(false);
  
  const goToNextVerse = () => {
    setIsLoading(true);
    
    // In a real app, we would fetch the next verse from an API
    // For demo purposes, we'll simulate loading and use the same verse
    setTimeout(() => {
      markVerseAsRead(verse.surah, verse.ayah);
      setCurrentVerseNumber(prev => prev + 1);
      setIsLoading(false);
    }, 500);
  };
  
  const goToPrevVerse = () => {
    if (currentVerseNumber <= 1) return;
    
    setIsLoading(true);
    
    // In a real app, we would fetch the previous verse from an API
    // For demo purposes, we'll simulate loading and use the same verse
    setTimeout(() => {
      setCurrentVerseNumber(prev => Math.max(prev - 1, 1));
      setIsLoading(false);
    }, 500);
  };
  
  return (
    <div className={cn("w-full space-y-6 pb-24", className)}>
      <VerseCard 
        surahName={sampleSurah.englishName}
        surahNumber={sampleSurah.id}
        verseNumber={currentVerseNumber}
        totalVerses={sampleSurah.numberOfAyahs}
        arabicText={verse.arabic}
        translation={verse.translation}
      />
      
      <div className="w-full flex items-center justify-between px-6">
        <button 
          onClick={goToPrevVerse}
          disabled={currentVerseNumber <= 1 || isLoading}
          className={cn(
            "h-14 w-32 rounded-full flex items-center justify-center glass-card transition-all duration-300",
            currentVerseNumber > 1 && !isLoading ? "hover:bg-white/10 active:scale-95" : "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-6 w-6 text-white mr-2" />
          <span className="text-white font-medium">Previous</span>
        </button>
        
        <button 
          onClick={() => {}}
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
        <div className="font-medium text-app-green">+7600</div>
        <p>Points earned for this verse</p>
      </div>
    </div>
  );
}
