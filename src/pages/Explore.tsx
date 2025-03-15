import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchSearchResults, fetchFullQuranData, Verse } from "@/utils/quranData";
import { expandSearchTerms } from "@/utils/searchUtils";
import SearchBar from "@/components/search/SearchBar";
import SearchFilters from "@/components/search/SearchFilters";
import SearchResults from "@/components/search/SearchResults";
import SearchLoadingIndicator from "@/components/search/SearchLoadingIndicator";
import ExploreHeader from "@/components/search/ExploreHeader";

const surahMapping: { [key: string]: number } = {
  "الفاتحة": 1, "البقرة": 2, "آل عمران": 3, "النساء": 4, "المائدة": 5, "الأنعام": 6, "الأعراف": 7,
  "الأنفال": 8, "التوبة": 9, "يونس": 10, "هود": 11, "يوسف": 12, "الرعد": 13, "إبراهيم": 14,
  "الحجر": 15, "النحل": 16, "الإسراء": 17, "الكهف": 18, "مريم": 19, "طه": 20, "الأنبياء": 21,
  "الحج": 22, "المؤمنون": 23, "النور": 24, "الفرقان": 25, "الشعراء": 26, "النمل": 27, "القصص": 28,
  "العنكبوت": 29, "الروم": 30, "لقمان": 31, "السجدة": 32, "الأحزاب": 33, "سبأ": 34, "فاطر": 35,
  "يس": 36, "الصافات": 37, "ص": 38, "الزمر": 39, "غافر": 40, "فصلت": 41, "الشورى": 42, "الزخرف": 43,
  "الدخان": 44, "الجاثية": 45, "الأحقاف": 46, "محمد": 47, "الفتح": 48, "الحجرات": 49, "ق": 50,
  "الذاريات": 51, "الطور": 52, "النجم": 53, "القمر": 54, "الرحمن": 55, "الواقعة": 56, "الحديد": 57,
  "المجادلة": 58, "الحشر": 59, "الممتحنة": 60, "الصف": 61, "الجمعة": 62, "المنافقون": 63, "التغابن": 64,
  "الطلاق": 65, "التحريم": 66, "الملك": 67, "القلم": 68, "الحاقة": 69, "المعارج": 70, "نوح": 71,
  "الجن": 72, "المزمل": 73, "المدثر": 74, "القيامة": 75, "الإنسان": 76, "المرسلات": 77, "النبأ": 78,
  "النازعات": 79, "عبس": 80, "التكوير": 81, "الانفطار": 82, "المطففين": 83, "الانشقاق": 84, "البروج": 85,
  "الطارق": 86, "الأعلى": 87, "الغاشية": 88, "الفجر": 89, "البلد": 90, "الشمس": 91, "الليل": 92,
  "الضحى": 93, "الشرح": 94, "التين": 95, "العلق": 96, "القدر": 97, "البينة": 98, "الزلزلة": 99,
  "العاديات": 100, "القارعة": 101, "التكاثر": 102, "العصر": 103, "الهمزة": 104, "الفيل": 105,
  "قريش": 106, "الماعون": 107, "الكوثر": 108, "الكافرون": 109, "النصر": 110, "المسد": 111,
  "الإخلاص": 112, "الفلق": 113, "الناس": 114
};

const englishSurahMapping: { [key: string]: number } = {
  "Al-Fatihah": 1, "Al-Baqarah": 2, "Ali 'Imran": 3, "An-Nisa": 4, "Al-Ma'idah": 5,
  "Al-An'am": 6, "Al-A'raf": 7, "Al-Anfal": 8, "At-Tawbah": 9, "Yunus": 10,
  "Hud": 11, "Yusuf": 12, "Ar-Ra'd": 13, "Ibrahim": 14, "Al-Hijr": 15,
  "An-Nahl": 16, "Al-Isra": 17, "Al-Kahf": 18, "Maryam": 19, "Ta-Ha": 20,
  "Al-Anbya": 21, "Al-Hajj": 22, "Al-Mu'minun": 23, "An-Nur": 24, "Al-Furqan": 25,
  "Ash-Shu'ara": 26, "An-Naml": 27, "Al-Qasas": 28, "Al-Ankabut": 29, "Ar-Rum": 30,
  "Luqman": 31, "As-Sajdah": 32, "Al-Ahzab": 33, "Saba": 34, "Fatir": 35,
  "Ya-Sin": 36, "As-Saffat": 37, "Sad": 38, "Az-Zumar": 39, "Ghafir": 40,
  "Fussilat": 41, "Ash-Shuraa": 42, "Az-Zukhruf": 43, "Ad-Dukhan": 44, "Al-Jathiyah": 45,
  "Al-Ahqaf": 46, "Muhammad": 47, "Al-Fath": 48, "Al-Hujurat": 49, "Qaf": 50,
  "Adh-Dhariyat": 51, "At-Tur": 52, "An-Najm": 53, "Al-Qamar": 54, "Ar-Rahman": 55,
  "Al-Waqi'ah": 56, "Al-Hadid": 57, "Al-Mujadila": 58, "Al-Hashr": 59, "Al-Mumtahanah": 60,
  "As-Saf": 61, "Al-Jumu'ah": 62, "Al-Munafiqun": 63, "At-Taghabun": 64, "At-Talaq": 65,
  "At-Tahrim": 66, "Al-Mulk": 67, "Al-Qalam": 68, "Al-Haqqah": 69, "Al-Ma'arij": 70,
  "Nuh": 71, "Al-Jinn": 72, "Al-Muzzammil": 73, "Al-Muddathir": 74, "Al-Qiyamah": 75,
  "Al-Insan": 76, "Al-Mursalat": 77, "An-Naba": 78, "An-Nazi'at": 79, "Abasa": 80,
  "At-Takwir": 81, "Al-Infitar": 82, "Al-Mutaffifin": 83, "Al-Inshiqaq": 84, "Al-Buruj": 85,
  "At-Tariq": 86, "Al-A'la": 87, "Al-Ghashiyah": 88, "Al-Fajr": 89, "Al-Balad": 90,
  "Ash-Shams": 91, "Al-Layl": 92, "Ad-Duha": 93, "Ash-Sharh": 94, "At-Tin": 95,
  "Al-Alaq": 96, "Al-Qadr": 97, "Al-Bayyinah": 98, "Az-Zalzalah": 99, "Al-Adiyat": 100,
  "Al-Qari'ah": 101, "At-Takathur": 102, "Al-Asr": 103, "Al-Humazah": 104, "Al-Fil": 105,
  "Quraysh": 106, "Al-Ma'un": 107, "Al-Kawthar": 108, "Al-Kafirun": 109, "An-Nasr": 110,
  "Al-Masad": 111, "Al-Ikhlas": 112, "Al-Falaq": 113, "An-Nas": 114
};

const Explore = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Verse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [expandedTerms, setExpandedTerms] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [totalVerses, setTotalVerses] = useState<number>(0);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const initializeSearch = async () => {
      console.log("Initializing search system...");
      setIsInitializing(true);
      setLoadingProgress(10);
      
      try {
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev < 90) return prev + (90 - prev) * 0.1;
            return prev;
          });
        }, 1000);
        
        const verses = await fetchFullQuranData();
        clearInterval(progressInterval);
        
        setTotalVerses(verses.length);
        setLoadingProgress(100);
        console.log(`Search system initialized with ${verses.length} verses`);
        
        toast({
          title: "Search Ready",
          description: `Loaded ${verses.length.toLocaleString()} verses for search`,
        });
        
        setTimeout(() => {
          setIsInitializing(false);
        }, 500);
      } catch (error) {
        console.error("Error initializing search:", error);
        toast({
          title: "Search Initialization Warning",
          description: "Using limited dataset for search. Some results may be missing.",
          variant: "destructive",
        });
        setIsInitializing(false);
      }
    };
    
    initializeSearch();
    
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    
    // Check if we should preserve the search state
    const { state } = location;
    if (state?.preserveSearch && query) {
      // If returning from reading a verse, don't re-initialize
      setIsInitializing(false);
    }
  }, [toast]);
  
  const addToRecentSearches = (searchQuery: string) => {
    const updatedSearches = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };
  
  const handleSearch = async (searchQuery?: string) => {
    const queryToUse = searchQuery || query;
    
    if (!queryToUse.trim()) {
      toast({
        title: "Search query is empty",
        description: "Please enter a keyword to search for",
      });
      return;
    }
    
    setIsSearching(true);
    console.log(`Searching for: "${queryToUse}"`);
    
    try {
      const terms = expandSearchTerms(queryToUse);
      setExpandedTerms(terms);
      console.log("Expanded terms:", terms);
      
      const searchResults = await fetchSearchResults(queryToUse);
      
      console.log(`Search completed with ${searchResults.length} results`);
      if (searchResults.length > 0) {
        console.log("First result:", searchResults[0]);
      }
      
      setResults(searchResults);
      
      if (searchResults.length > 0) {
        addToRecentSearches(queryToUse);
      }
      
      if (searchResults.length === 0) {
        toast({
          title: "No results found",
          description: `No verses found for "${queryToUse}"`,
        });
      }
    } catch (error) {
      console.error("Search failed:", error);
      toast({
        title: "Search failed",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const navigateToVerse = (verse: Verse) => {
    let surahNumber = verse.surah;
    
    if (!surahNumber && verse.surahName) {
      surahNumber = surahMapping[verse.surahName];
      
      if (!surahNumber) {
        surahNumber = englishSurahMapping[verse.surahName];
      }
    }
    
    const verseNumber = verse.ayah || (verse as any).ayahNumber || (verse as any).verseNumber;
    
    console.log("Navigating with verse data:", {
      originalVerse: verse,
      resolvedSurah: surahNumber,
      resolvedVerse: verseNumber,
      surahNameProvided: verse.surahName
    });
    
    if (!surahNumber || !verseNumber) {
      console.error("Navigation error - Missing verse information:", verse);
      toast({
        title: "Navigation error",
        description: "Cannot navigate to this verse due to missing information",
        variant: "destructive",
      });
      return;
    }
    
    console.log(`Navigating to surah: ${surahNumber}, ayah: ${verseNumber}`);
    navigate(`/reading?surah=${surahNumber}&verse=${verseNumber}`, {
      state: { fromSearch: true }
    });
  };
  
  return (
    <div className="min-h-screen bg-app-background pb-20">
      <Header showBack={false} />
      
      <main className="max-w-screen-md mx-auto space-y-6 py-4">
        <div className="px-6">
          <ExploreHeader 
            isInitializing={isInitializing}
            loadingProgress={loadingProgress}
            totalVerses={totalVerses}
          />
        </div>
        
        {isInitializing && (
          <div className="px-6">
            <SearchLoadingIndicator loadingProgress={loadingProgress} />
          </div>
        )}
        
        <div className="px-6">
          <SearchBar
            query={query}
            setQuery={setQuery}
            handleSearch={handleSearch}
            isSearching={isSearching}
            isInitializing={isInitializing}
            recentSearches={recentSearches}
          />
        </div>
        
        <div className="px-6">
          <SearchFilters
            expandedTerms={expandedTerms}
            query={query}
          />
        </div>
        
        <div className="px-6">
          <SearchResults
            results={results}
            isSearching={isSearching}
            query={query}
            isInitializing={isInitializing}
            navigateToVerse={navigateToVerse}
            handleSearch={handleSearch}
          />
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Explore;
