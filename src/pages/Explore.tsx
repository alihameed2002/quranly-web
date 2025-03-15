import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Search, Info, Loader2, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import VerseCard from "@/components/VerseCard";
import { useNavigate } from "react-router-dom";
import { fetchSearchResults, fetchFullQuranData } from "@/utils/quranData";
import { Verse } from "@/utils/quranData";
import { expandSearchTerms } from "@/utils/searchUtils";
import { Input } from "@/components/ui/input";
import debounce from 'lodash/debounce';
import { Progress } from "@/components/ui/progress";

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
  }, [toast]);
  
  const addToRecentSearches = (searchQuery: string) => {
    const updatedSearches = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };
  
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      if (searchTerm.trim().length >= 3) {
        handleSearch(searchTerm);
      }
    }, 500),
    []
  );
  
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (newQuery.length >= 3) {
      debouncedSearch(newQuery);
    } else if (newQuery.length === 0) {
      setResults([]);
      setExpandedTerms([]);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      debouncedSearch.cancel();
      handleSearch();
    }
  };
  
  const navigateToVerse = (verse: Verse) => {
    // Check if verse has the necessary properties, with fallbacks
    const surahNumber = verse.surah || (verse as any).surahNumber;
    const ayahNumber = verse.ayah || (verse as any).ayahNumber || (verse as any).verseNumber;
    
    if (!surahNumber || !ayahNumber) {
      console.error("Navigation error - Missing verse information:", verse);
      toast({
        title: "Navigation error",
        description: "Cannot navigate to this verse due to missing information",
        variant: "destructive",
      });
      return;
    }
    
    console.log(`Navigating to surah: ${surahNumber}, ayah: ${ayahNumber}`);
    navigate(`/reading?surah=${surahNumber}&verse=${ayahNumber}`);
  };
  
  return (
    <div className="min-h-screen bg-app-background pb-20">
      <Header showBack={false} />
      
      <main className="max-w-screen-md mx-auto space-y-6 py-4">
        <div className="px-6 flex items-center space-x-3">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
            <Search className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Explore Quran</h1>
            <p className="text-app-text-secondary">
              {isInitializing 
                ? `Loading search database (${Math.round(loadingProgress)}%)...` 
                : totalVerses > 0 
                  ? `Search across ${totalVerses.toLocaleString()} verses` 
                  : "Search for verses by keyword"}
            </p>
          </div>
        </div>
        
        {isInitializing && (
          <div className="px-6">
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-4 w-4 text-app-green" />
                <span className="text-sm font-medium text-white">Loading Quran database</span>
              </div>
              <Progress 
                value={loadingProgress} 
                className="h-2 bg-white/10" 
              />
              <p className="text-xs mt-2 text-app-text-secondary">
                Loading all 114 chapters for comprehensive search. This might take a moment...
              </p>
            </div>
          </div>
        )}
        
        <div className="px-6">
          <div className="glass-card rounded-xl p-4 space-y-4">
            <div className="relative">
              <Input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search the Quran..."
                className="w-full h-12 bg-white/5 border border-white/10 rounded-lg px-4 pr-12 text-white"
                onKeyDown={handleKeyDown}
                disabled={isInitializing}
              />
              <button 
                onClick={() => handleSearch()}
                disabled={isSearching || isInitializing || !query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center bg-app-green text-app-background-dark hover:bg-app-green-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {recentSearches.length > 0 && !query.trim() && !isInitializing && (
              <div className="pt-2">
                <p className="text-xs text-app-text-secondary mb-2">Recent searches:</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuery(term);
                        handleSearch(term);
                      }}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs text-app-text-secondary transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {expandedTerms.length > 0 && query.trim() && (
          <div className="px-6">
            <div className="flex items-center gap-1 text-xs text-app-text-secondary">
              <Info className="h-3 w-3" />
              <span>Search includes related terms:</span>
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {expandedTerms.slice(0, 10).map((term, i) => (
                <span key={i} className="px-2 py-0.5 bg-white/5 rounded-full text-xs text-app-text-secondary">
                  {term}
                </span>
              ))}
              {expandedTerms.length > 10 && (
                <span className="px-2 py-0.5 rounded-full text-xs text-app-text-secondary">
                  +{expandedTerms.length - 10} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {results.length > 0 && (
          <div className="px-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Search Results ({results.length})
            </h2>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div 
                  key={`${result.surah || index}-${result.ayah || index}-${index}`}
                  className="glass-card rounded-xl p-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => navigateToVerse(result)}
                >
                  <VerseCard
                    surahName={result.surahName || ""}
                    surahNumber={result.surah || 0}
                    verseNumber={result.ayah || 0}
                    totalVerses={result.totalVerses || 0}
                    arabicText={result.arabic || ""}
                    translation={result.translation || ""}
                    minimized={true}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {query && !isSearching && results.length === 0 && !isInitializing && (
          <div className="px-6 py-10 text-center">
            <div className="text-app-text-secondary">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-lg">No results found for "{query}"</p>
              <p className="mt-2 text-sm opacity-70">
                Try using different keywords or more general terms
              </p>
            </div>
          </div>
        )}
        
        {!query && results.length === 0 && !isSearching && !isInitializing && (
          <div className="px-6 mt-8">
            <div className="glass-card rounded-xl p-6 text-center">
              <p className="text-white mb-4">Search Examples:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "mercy", "patience", "forgiveness", 
                  "guidance", "prayer", "faith", "paradise",
                  "light", "hope", "charity"
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(example);
                      handleSearch(example);
                    }}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-app-text-secondary transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Navigation />
    </div>
  );
};

export default Explore;
