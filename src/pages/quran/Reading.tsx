import { useState, useEffect } from "react";
import Header from "@/components/Header";
import QuranReader from "@/components/QuranReader";
import Navigation from "@/components/Navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

const QuranReading = () => {
  const [loading, setLoading] = useState(true);
  const [currentSurah, setCurrentSurah] = useState(1); // Default to Al-Fatiha
  const [currentVerse, setCurrentVerse] = useState(1); // Default to first verse
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Parse surah and verse from URL query parameters
    const params = new URLSearchParams(location.search);
    const surahParam = params.get('surah');
    const verseParam = params.get('verse');
    
    console.log(`URL parameters: surah=${surahParam}, verse=${verseParam}`);
    
    let validSurah = 1; // Default to Al-Fatiha
    let validVerse = 1; // Default to first verse
    
    if (surahParam) {
      const surahNum = Number(surahParam);
      // Validate surah number (1-114)
      if (!isNaN(surahNum) && surahNum >= 1 && surahNum <= 114) {
        validSurah = surahNum;
      } else {
        console.warn(`Invalid surah parameter: ${surahParam}, using default`);
      }
    }
    
    if (verseParam) {
      const verseNum = Number(verseParam);
      if (!isNaN(verseNum) && verseNum >= 1) {
        validVerse = verseNum;
      } else {
        console.warn(`Invalid verse parameter: ${verseParam}, using default`);
      }
    }
    
    console.log(`Setting surah=${validSurah}, verse=${validVerse}`);
    setCurrentSurah(validSurah);
    setCurrentVerse(validVerse);
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [location.search]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-app-background flex items-center justify-center">
        <div className="glass-card rounded-lg p-8 flex flex-col items-center justify-center animate-pulse-gentle">
          <div className="h-10 w-10 border-4 border-app-green border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-app-text-secondary">Loading your Quran...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-app-background pb-20">
      <Header showBack={false} />
      
      <main className="max-w-screen-md mx-auto space-y-8 py-4">
        <div className="px-6 flex items-center space-x-3">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Reading Quran</h1>
            <p className="text-app-text-secondary">Continue your journey</p>
          </div>
        </div>
        
        <QuranReader
          initialSurah={currentSurah}
          initialVerse={currentVerse}
        />
      </main>
      
      <Navigation />
    </div>
  );
};

export default QuranReading;
