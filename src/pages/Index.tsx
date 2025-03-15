
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Book, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import VerseCard from "@/components/VerseCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchQuranData, fetchSurahs, Surah } from "@/utils/quranData";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

const Index = () => {
  const navigate = useNavigate();
  const { user, userProgress } = useAuth();
  const [featuredVerse, setFeaturedVerse] = useState<{
    surahName: string;
    surahNumber: number;
    verseNumber: number;
    totalVerses: number;
    arabicText: string;
    translation: string;
  } | null>(null);
  const [isLoadingVerse, setIsLoadingVerse] = useState(true);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadFeaturedVerse = async () => {
      setIsLoadingVerse(true);
      try {
        // Load from user progress if available, otherwise use default
        const surahNumber = userProgress?.lastSurah || 1;
        const verseNumber = userProgress?.lastVerse || 1;
        
        const { surah, verse } = await fetchQuranData(surahNumber, verseNumber);
        
        setFeaturedVerse({
          surahName: surah.englishName,
          surahNumber: surah.id,
          verseNumber: verse.ayah,
          totalVerses: surah.numberOfAyahs,
          arabicText: verse.arabic,
          translation: verse.translation,
        });
      } catch (error) {
        console.error("Error loading featured verse:", error);
      } finally {
        setIsLoadingVerse(false);
      }
    };

    const loadSurahs = async () => {
      try {
        const surahList = await fetchSurahs();
        setSurahs(surahList);
      } catch (error) {
        console.error("Error loading surahs:", error);
      }
    };

    loadFeaturedVerse();
    loadSurahs();
  }, [userProgress]);

  const filteredSurahs = searchQuery ? 
    surahs.filter(surah => 
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase())
    ) : 
    surahs;

  const handleGoToReading = () => {
    if (featuredVerse) {
      navigate(`/reading?surah=${featuredVerse.surahNumber}&verse=${featuredVerse.verseNumber}`);
    }
  };

  return (
    <div className="min-h-screen bg-app-background pb-20">
      <Header showBack={false} />
      
      <main className="max-w-screen-md mx-auto space-y-8 py-4">
        <div className="px-6 flex items-center space-x-3">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <Book className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Quran App</h1>
            <p className="text-app-text-secondary">Continue your reading journey</p>
          </div>
        </div>

        <div className="px-6">
          <div className="relative glass-card rounded-xl p-4">
            <h2 className="text-lg font-medium text-white mb-2">
              {isLoadingVerse ? "Loading..." : `Continue Reading from ${featuredVerse?.surahName}`}
            </h2>
            
            {isLoadingVerse ? (
              <div className="h-32 flex items-center justify-center">
                <div className="h-8 w-8 border-4 border-app-green/30 border-t-app-green rounded-full animate-spin"></div>
              </div>
            ) : featuredVerse ? (
              <div onClick={handleGoToReading} className="cursor-pointer">
                <VerseCard
                  surahName={featuredVerse.surahName}
                  surahNumber={featuredVerse.surahNumber}
                  verseNumber={featuredVerse.verseNumber}
                  totalVerses={featuredVerse.totalVerses}
                  arabicText={featuredVerse.arabicText}
                  translation={featuredVerse.translation}
                  minimized={true}
                />
                
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleGoToReading} className="bg-app-green hover:bg-app-green-light text-app-background-dark">
                    Continue Reading
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-app-text-secondary">
                No verse selected. Start your reading journey now.
              </p>
            )}
          </div>
        </div>

        <div className="px-6">
          <div className="glass-card rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-white">Browse Surahs</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-app-text-secondary hover:text-white"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="h-4 w-4 mr-1" />
                Search
              </Button>
            </div>

            {searchOpen && (
              <Command className="rounded-lg border border-white/10 bg-app-background-light mb-4">
                <CommandInput
                  placeholder="Search surahs..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {filteredSurahs.slice(0, 5).map((surah) => (
                      <CommandItem
                        key={surah.id}
                        onSelect={() => navigate(`/reading?surah=${surah.id}&verse=1`)}
                      >
                        <div className="flex items-center">
                          <span className="w-8 h-8 rounded-full bg-app-green/10 text-app-green flex items-center justify-center mr-2">
                            {surah.id}
                          </span>
                          {surah.englishName} ({surah.englishNameTranslation})
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            )}

            <div className="space-y-2">
              {filteredSurahs.slice(0, 5).map((surah) => (
                <div
                  key={surah.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer"
                  onClick={() => navigate(`/reading?surah=${surah.id}&verse=1`)}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-app-green/10 text-app-green flex items-center justify-center mr-3">
                      {surah.id}
                    </span>
                    <div>
                      <h3 className="text-white font-medium">{surah.englishName}</h3>
                      <p className="text-app-text-secondary text-sm">{surah.englishNameTranslation}</p>
                    </div>
                  </div>
                  <div className="text-app-text-secondary text-sm">{surah.numberOfAyahs} verses</div>
                </div>
              ))}

              <div className="pt-2">
                <Button
                  variant="ghost"
                  className="w-full border border-white/10 text-app-text-secondary hover:text-white hover:bg-white/5"
                  onClick={() => navigate("/explore")}
                >
                  View All Surahs
                </Button>
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
