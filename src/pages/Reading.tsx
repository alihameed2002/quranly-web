
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import QuranReader from "@/components/QuranReader";
import AudioPlayer from "@/components/AudioPlayer";
import Navigation from "@/components/Navigation";
import { useProgress } from "@/hooks/useProgress";
import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Reading = () => {
  const { progress, getTimeSpentFormatted } = useProgress();
  const [loading, setLoading] = useState(true);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [currentSurah, setCurrentSurah] = useState(7); // Default to Al-Araf
  const [currentVerse, setCurrentVerse] = useState(128); // Default to sample verse
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Parse surah and verse from URL query parameters
    const params = new URLSearchParams(location.search);
    const surahParam = params.get('surah');
    const verseParam = params.get('verse');
    
    if (surahParam && !isNaN(Number(surahParam))) {
      setCurrentSurah(Number(surahParam));
    }
    
    if (verseParam && !isNaN(Number(verseParam))) {
      setCurrentVerse(Number(verseParam));
    }
    
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
  
  // Format timeSpent for Header component
  const formattedTimeSpent = getTimeSpentFormatted();
  
  return (
    <div className="min-h-screen bg-app-background pb-20">
      <Header
        totalPoints={progress.points / 1000}
        totalVerses={progress.totalVerses}
        timeSpent={formattedTimeSpent}
        showBack={false}
      />
      
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
        
        <div className="px-6">
          <button 
            onClick={() => setShowAudioPlayer(!showAudioPlayer)}
            className="w-full py-3 rounded-lg glass-card text-white font-medium hover:bg-white/10 transition-all duration-300"
          >
            {showAudioPlayer ? "Hide Audio Player" : "Show Audio Player"}
          </button>
          
          {showAudioPlayer && (
            <div className="mt-4">
              <AudioPlayer 
                surahId={currentSurah}
                verseId={currentVerse}
              />
            </div>
          )}
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Reading;
