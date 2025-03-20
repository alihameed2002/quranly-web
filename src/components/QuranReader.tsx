import { ChevronLeft, ChevronRight, Search, X, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import VerseCard from "./VerseCard";
import { fetchQuranData, fetchSurah, fetchSurahs, Verse, Surah } from "@/utils/quranData";
import { useProgress } from "@/hooks/useProgress";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface QuranReaderProps {
  className?: string;
  initialSurah?: number;
  initialAyah?: number;
}

export default function QuranReader({ 
  className,
  initialSurah = 1, // Default to Surah Al-Fatiha
  initialAyah = 1  // Default to first verse
}: QuranReaderProps) {
  const { markVerseAsRead } = useProgress();
  const { toast } = useToast();
  const [currentSurah, setCurrentSurah] = useState(initialSurah);
  const [currentVerseNumber, setCurrentVerseNumber] = useState(initialAyah);
  const [surahData, setSurahData] = useState<Surah | null>(null);
  const [verseData, setVerseData] = useState<Verse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [verseFilter, setVerseFilter] = useState<string>("");
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("surahs");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const fromSearch = location.state?.fromSearch || false;
  const searchQuery = location.state?.lastQuery || "";
  const searchResults = location.state?.results || [];
  const scrollPosition = location.state?.scrollPosition || 0;
  
  // Get all surahs
  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const surahsList = await fetchSurahs();
        setSurahs(surahsList);
      } catch (error) {
        console.error("Failed to load surah list:", error);
      }
    };
    
    loadSurahs();
  }, []);
  
  // Get current surah data and verse
  useEffect(() => {
    const loadVerseData = async () => {
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
        
        if (verse.surah !== validSurah || verse.ayah !== validVerse) {
          console.warn(`Received incorrect verse: got surah ${verse.surah}, ayah ${verse.ayah} but requested surah ${validSurah}, ayah ${validVerse}`);
          
          if (verse.surah === 7 && verse.ayah === 128 && (validSurah !== 7 || validVerse !== 128)) {
            throw new Error("Could not load the requested verse.");
          }
        }
        
        setSurahData(surah);
        setVerseData(verse);
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
  
  useEffect(() => {
    console.log(`Props updated: initialSurah=${initialSurah}, initialAyah=${initialAyah}`);
    
    const validSurah = Number(initialSurah);
    const validVerse = Number(initialAyah);
    
    if (!isNaN(validSurah) && !isNaN(validVerse) && validSurah > 0 && validVerse > 0) {
      setCurrentSurah(validSurah);
      setCurrentVerseNumber(validVerse);
    } else {
      console.warn(`Received invalid initialSurah=${initialSurah} or initialAyah=${initialAyah}, using defaults`);
    }
  }, [initialSurah, initialAyah]);
  
  const goToNextVerse = () => {
    if (isLoading || !surahData) return;
    
    if (currentVerseNumber < surahData.numberOfAyahs) {
      setCurrentVerseNumber(prev => prev + 1);
      markVerseAsRead(currentSurah, currentVerseNumber);
    } else if (currentSurah < 114) {
      setCurrentSurah(prev => prev + 1);
      setCurrentVerseNumber(1);
      markVerseAsRead(currentSurah, currentVerseNumber);
    } else {
      toast({
        title: "End of Quran",
        description: "You have reached the end of the Quran.",
      });
    }
  };
  
  const goToPrevVerse = () => {
    if (isLoading || (currentVerseNumber <= 1 && currentSurah <= 1)) return;
    
    if (currentVerseNumber > 1) {
      setCurrentVerseNumber(prev => prev - 1);
    } else if (currentSurah > 1) {
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
      description: "You've completed this verse.",
    });
  };
  
  const returnToSearchResults = () => {
    console.log("Returning to search results with:", {
      query: searchQuery,
      resultsCount: searchResults.length,
      scrollPosition
    });
    
    navigate('/explore', { 
      state: { 
        preserveSearch: true,
        lastQuery: searchQuery,
        results: searchResults,
        scrollPosition: scrollPosition
      } 
    });
  };
  
  // Get filtered surahs based on filter text
  const getFilteredSurahs = (): Surah[] => {
    return surahs.filter(surah => 
      verseFilter === "" || 
      surah.englishName.toLowerCase().includes(verseFilter.toLowerCase()) || 
      surah.id.toString().includes(verseFilter)
    );
  };
  
  // Get verses for the selected surah
  const getVersesForSurah = (surahId: number): number[] => {
    const surah = surahs.find(s => s.id === surahId);
    if (!surah) return [];
    
    return Array.from({ length: surah.numberOfAyahs }, (_, i) => i + 1);
  };
  
  // Get filtered verses based on filter text
  const getFilteredVerses = (): number[] => {
    if (!selectedSurah) return [];
    
    const verses = getVersesForSurah(selectedSurah);
    
    if (verseFilter === "") return verses;
    
    return verses.filter(verse => 
      verse.toString().includes(verseFilter)
    );
  };
  
  // Handler for changing surah
  const handleSurahChange = (surahId: number) => {
    setCurrentSurah(surahId);
    setCurrentVerseNumber(1);
    navigate(`/quran/reading?surah=${surahId}&ayah=1`, { replace: true });
  };
  
  // Handler for changing verse
  const handleVerseChange = (verseNumber: number) => {
    setCurrentVerseNumber(verseNumber);
    navigate(`/quran/reading?surah=${currentSurah}&ayah=${verseNumber}`, { replace: true });
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
          onClick={() => window.location.href = '/quran/reading'}
          className="px-4 py-2 bg-app-green text-app-background-dark rounded-full"
        >
          Go to default verse
        </button>
      </div>
    );
  }
  
  return (
    <div className={cn("w-full space-y-6 pb-24", className)}>
      {fromSearch && (
        <div className="px-6 pt-2">
          <Button 
            variant="outline" 
            onClick={returnToSearchResults}
            className="glass-card text-white border-white/20 hover:bg-white/10 hover:text-white"
          >
            <Search className="h-4 w-4 mr-2" />
            Return to Results
          </Button>
        </div>
      )}
      
      <div className="px-6 mb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="h-14 px-6 py-4 bg-gradient-to-r from-slate-800/80 via-slate-800/60 to-slate-800/80 border border-slate-700 rounded-md flex items-center justify-center text-lg font-medium text-white shadow-inner flex-1">
            {surahData ? `${surahData.englishName} (${surahData.name})` : "Loading..."}
          </div>

          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white" onClick={() => setDrawerOpen(true)}>
                <BookOpen className="h-4 w-4 mr-2" />
                Browse
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-app-background border-t border-slate-700">
              <div className="mx-auto w-full max-w-4xl">
                <DrawerHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <DrawerTitle className="text-white">Browse the Quran</DrawerTitle>
                      <DrawerDescription className="text-app-text-secondary">
                        {selectedSurah 
                          ? `Surah ${selectedSurah}: ${surahs.find(s => s.id === selectedSurah)?.englishName || ''}`
                          : '114 Surahs with 6,236 Verses'}
                      </DrawerDescription>
                    </div>
                    <DrawerClose asChild>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-slate-800 hover:text-white">
                        <X className="h-4 w-4" />
                      </Button>
                    </DrawerClose>
                  </div>
                </DrawerHeader>
                
                <div className="px-4 py-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder={selectedSurah ? "Filter verses..." : "Search surahs..."}
                      className="bg-slate-800 border-slate-700 text-white pl-10 transition-all duration-300"
                      value={verseFilter}
                      onChange={(e) => setVerseFilter(e.target.value)}
                    />
                    {verseFilter && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400 hover:text-white" 
                        onClick={() => setVerseFilter("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="h-[60vh] px-4 overflow-hidden">
                  {selectedSurah ? (
                    <div className="animate-in fade-in slide-in-from-right duration-300 space-y-4">
                      <div className="flex items-center justify-between">
                        <Button 
                          variant="ghost" 
                          className="text-white hover:bg-slate-800 px-2 flex items-center"
                          onClick={() => {
                            setSelectedSurah(null);
                            setVerseFilter("");
                          }}
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Back to Surahs
                        </Button>
                      </div>
                      
                      <div className="rounded-md bg-slate-800/50 border border-slate-700 p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-white font-medium">
                            {surahs.find(s => s.id === selectedSurah)?.englishName || `Surah ${selectedSurah}`}
                          </h3>
                          <span className="text-xs bg-teal-500/20 text-teal-400 px-2 py-1 rounded-full">
                            {surahs.find(s => s.id === selectedSurah)?.numberOfAyahs || 0} verses
                          </span>
                        </div>
                        
                        <ScrollArea className="h-[45vh] pr-2">
                          <div className="grid grid-cols-5 gap-2">
                            {getFilteredVerses().map(verseNum => (
                              <Button
                                key={verseNum}
                                variant={currentSurah === selectedSurah && currentVerseNumber === verseNum ? "default" : "outline"}
                                className={`
                                  ${currentSurah === selectedSurah && currentVerseNumber === verseNum 
                                    ? "bg-teal-500 hover:bg-teal-600 text-slate-900" 
                                    : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"}
                                  transition-all duration-200 hover:scale-105
                                `}
                                onClick={() => {
                                  setCurrentSurah(selectedSurah);
                                  setCurrentVerseNumber(verseNum);
                                  setDrawerOpen(false);
                                  navigate(`/quran/reading?surah=${selectedSurah}&ayah=${verseNum}`, { replace: true });
                                }}
                              >
                                {verseNum}
                              </Button>
                            ))}
                          </div>
                          
                          {getFilteredVerses().length === 0 && (
                            <div className="py-8 text-center text-app-text-secondary">
                              No verses match your filter
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                    </div>
                  ) : (
                    <ScrollArea className="h-[55vh]">
                      <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-left duration-300">
                        {getFilteredSurahs().map(surah => (
                          <Button
                            key={surah.id}
                            variant={currentSurah === surah.id ? "default" : "outline"}
                            className={`
                              ${currentSurah === surah.id 
                                ? "bg-teal-500 hover:bg-teal-600 text-slate-900" 
                                : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"}
                              justify-between h-auto py-3 flex-col items-start px-4
                              transition-all duration-200 hover:scale-[1.02] hover:shadow-lg
                            `}
                            onClick={() => {
                              setSelectedSurah(surah.id);
                              setVerseFilter("");
                            }}
                          >
                            <div className="flex w-full justify-between items-center">
                              <span className="font-medium">Surah {surah.id}</span>
                              <span className="text-xs bg-teal-500/20 text-teal-400 px-2 py-1 rounded-full">
                                {surah.numberOfAyahs} verses
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 text-left mt-1 truncate w-full">
                              {surah.englishName} ({surah.name})
                            </div>
                          </Button>
                        ))}
                      </div>
                      
                      {getFilteredSurahs().length === 0 && (
                        <div className="py-8 text-center text-app-text-secondary">
                          No surahs match your filter
                        </div>
                      )}
                    </ScrollArea>
                  )}
                </div>
                
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button className="bg-teal-500 hover:bg-teal-600 text-slate-900 transition-all duration-200 hover:scale-[1.02]">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
      
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
    </div>
  );
}
