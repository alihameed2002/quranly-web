
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Search, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import VerseCard from "@/components/VerseCard";
import { useNavigate } from "react-router-dom";
import { fetchSearchResults, extendedSampleVerses, fetchFullQuranData } from "@/utils/quranData";
import { Verse } from "@/utils/quranData";
import { expandSearchTerms } from "@/utils/searchUtils";
import { Input } from "@/components/ui/input";

const Explore = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Verse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedTerms, setExpandedTerms] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // Initialize the search system
  useEffect(() => {
    // Preload full Quran data for faster searches
    const initializeSearch = async () => {
      console.log("Initializing search system...");
      try {
        // This will cache the full Quran data for faster subsequent searches
        await fetchFullQuranData();
        console.log("Search system initialized");
      } catch (error) {
        console.error("Error initializing search:", error);
      }
    };
    
    initializeSearch();
    
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);
  
  // Save recent searches to localStorage
  const addToRecentSearches = (searchQuery: string) => {
    const updatedSearches = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5); // Keep only the 5 most recent
    
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
      // Get expanded search terms for display
      const terms = expandSearchTerms(queryToUse);
      setExpandedTerms(terms);
      console.log("Expanded terms:", terms);
      
      // Perform the search
      const searchResults = await fetchSearchResults(queryToUse);
      
      console.log(`Search completed with ${searchResults.length} results`);
      if (searchResults.length > 0) {
        console.log("First result:", searchResults[0]);
      }
      
      setResults(searchResults);
      
      // Add to recent searches
      if (searchResults.length > 0) {
        addToRecentSearches(queryToUse);
      }
      
      if (searchResults.length === 0) {
        toast({
          title: "No results found",
          description: `No verses found for "${queryToUse}"`,
        });
      } else {
        toast({
          title: "Search completed",
          description: `Found ${searchResults.length} results for "${queryToUse}"`,
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
  
  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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
            <p className="text-app-text-secondary">Search for verses by keyword</p>
          </div>
        </div>
        
        <div className="px-6">
          <div className="glass-card rounded-xl p-4 space-y-4">
            <div className="relative">
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the Quran..."
                className="w-full h-12 bg-white/5 border border-white/10 rounded-lg px-4 pr-12 text-white"
                onKeyDown={handleKeyDown}
              />
              <button 
                onClick={() => handleSearch()}
                disabled={isSearching}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center bg-app-green text-app-background-dark hover:bg-app-green-light transition-all duration-300"
              >
                {isSearching ? (
                  <div className="h-4 w-4 border-2 border-app-background-dark border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {recentSearches.length > 0 && !query.trim() && (
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
              {results.map((result) => (
                <div 
                  key={`${result.surah}-${result.ayah}`}
                  className="glass-card rounded-xl p-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => navigate(`/reading?surah=${result.surah}&verse=${result.ayah}`)}
                >
                  <VerseCard
                    surahName={result.surahName || ""}
                    surahNumber={result.surah}
                    verseNumber={result.ayah}
                    totalVerses={result.totalVerses || 0}
                    arabicText={result.arabic}
                    translation={result.translation}
                    minimized={true}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {query && !isSearching && results.length === 0 && (
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
        
        {!query && results.length === 0 && !isSearching && (
          <div className="px-6 mt-8">
            <div className="glass-card rounded-xl p-6 text-center">
              <p className="text-white mb-4">Search Examples:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "mercy", "patience", "forgiveness", 
                  "guidance", "prayer", "faith"
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
