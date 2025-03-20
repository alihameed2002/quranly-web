import { useState, useEffect } from "react";
import Header from "@/components/Header";
import UserProfile from "@/components/UserProfile";
import ProgressStats from "@/components/ProgressStats";
import QuranReader from "@/components/QuranReader";
import AudioPlayer from "@/components/AudioPlayer";
import Navigation from "@/components/Navigation";
import { useProgress } from "@/hooks/useProgress";
import { Users, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { progress, getTimeSpentFormatted } = useProgress();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
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
        totalVerses={progress.totalVerses}
        timeSpent={formattedTimeSpent}
        showBack={false}
      />
      
      <main className="max-w-screen-md mx-auto space-y-8 py-4">
        <UserProfile 
          name="Ali Hameed"
          greeting="Asalam Alaykum"
          avatarInitials="AH"
          notifications={2}
        />
        
        <div className="px-6 space-y-4">
          <div className="glass-card rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Ramadan Challenge</h3>
              <span className="text-app-text-secondary text-sm">1 day ago</span>
            </div>
            
            <p className="text-app-text-secondary">Finish the entire Quran this Ramadan!</p>
            
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full bg-pink-500 border border-app-background z-30"></div>
                <div className="h-6 w-6 rounded-full bg-blue-500 border border-app-background z-20"></div>
                <div className="h-6 w-6 rounded-full bg-green-500 border border-app-background z-10"></div>
              </div>
              <span className="text-app-text-secondary text-sm">279.9K Participants</span>
            </div>
            
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[10%] bg-app-purple rounded-full"></div>
            </div>
            
            <div className="flex justify-between items-center text-sm text-app-text-secondary">
              <span>1/30 Juz</span>
              <span>0%</span>
            </div>
          </div>
        </div>
        
        <div className="w-full flex overflow-x-auto hide-scrollbar px-6 space-x-4 pb-2">
          <div 
            className="flex-none w-32 h-32 glass-card rounded-xl p-4 flex flex-col items-center justify-center space-y-3 hover:bg-white/5 transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/reading')}
          >
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <p className="text-app-text-secondary text-sm">Today</p>
              <p className="text-lg font-medium text-white">Reading</p>
            </div>
          </div>
          
          <div className="flex-none w-32 h-32 glass-card rounded-xl p-4 flex flex-col items-center justify-center space-y-3 hover:bg-white/5 transition-all duration-300">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <p className="text-app-text-secondary text-sm">Friends</p>
              <p className="text-lg font-medium text-white">12 Active</p>
            </div>
          </div>
          
          <div className="flex-none w-32 h-32 glass-card rounded-xl p-4 flex flex-col items-center justify-center space-y-3 hover:bg-white/5 transition-all duration-300">
            <div className="relative h-12 w-12 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <p className="text-app-text-secondary text-sm">Hasanat</p>
              <p className="text-lg font-medium text-white">457.1K</p>
            </div>
          </div>
          
          <div className="flex-none w-32 h-32 glass-card rounded-xl p-4 flex flex-col items-center justify-center space-y-3 hover:bg-white/5 transition-all duration-300">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 5H21" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 12H21" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 19H21" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-app-text-secondary text-sm">Verses</p>
              <p className="text-lg font-medium text-white">75</p>
            </div>
          </div>
        </div>
        
        <div className="pt-6">
          <div className="w-full flex items-center justify-between px-6 mb-4">
            <h2 className="text-xl font-semibold text-white">Continue Reading</h2>
            <button className="text-app-green text-sm font-medium">See All</button>
          </div>
          
          <div className="px-6 glass-card rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">1. Al-Fatiha</h3>
                <p className="text-app-text-secondary text-sm">1/7</p>
              </div>
              <div className="flex items-center space-x-1 text-app-text-secondary text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#A99FC2" />
                </svg>
                <span>5.7K</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/reading')}
              className="w-full py-3 rounded-lg glass-card text-white font-medium hover:bg-white/10 transition-all duration-300"
            >
              Continue Reading
            </button>
            
            {/* New content below the Read More button */}
            <div className="mt-4 glass-card rounded-xl p-4">
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-medium text-white">Today's Verse</h3>
                
                <div className="space-y-3">
                  <p className="text-right text-xl leading-loose font-arabic text-white" dir="rtl">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  
                  <p className="text-app-text-secondary">
                    In the name of Allah, the Entirely Merciful, the Especially Merciful.
                  </p>
                  
                  <div className="flex justify-between items-center text-sm text-app-text-secondary pt-2">
                    <span>Surah Al-Fatiha (1:1)</span>
                    <button className="text-app-green flex items-center space-x-1">
                      <span>Read Tafsir</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Index;
