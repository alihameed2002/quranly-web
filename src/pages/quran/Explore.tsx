
import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { fetchSearchResults } from "@/utils/searchFunctions";
import { Verse } from "@/utils/quranData";
import SearchBar from "@/components/search/SearchBar";
import SearchFilters from "@/components/search/SearchFilters";
import SearchLoadingIndicator from "@/components/search/SearchLoadingIndicator";
import SearchResults from "@/components/search/SearchResults";

const QuranExplore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [expandedTerms, setExpandedTerms] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if there's state from navigation
  useEffect(() => {
    if (location.state?.preserveSearch) {
      const { lastQuery, results, scrollPosition } = location.state;
      
      if (lastQuery) {
        console.log("Restoring previous search:", lastQuery);
        setSearchQuery(lastQuery);
      }
      
      if (results && Array.isArray(results)) {
        console.log(`Restoring ${results.length} search results`);
        setSearchResults(results);
      }
      
      // Restore scroll position after render
      setTimeout(() => {
        if (resultsContainerRef.current && scrollPosition) {
          resultsContainerRef.current.scrollTop = scrollPosition;
        }
      }, 100);
    }
    
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("quranRecentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    
    setIsInitializing(false);
  }, [location.state]);
  
  const addToRecentSearches = (query: string) => {
    if (!query.trim()) return;
    
    const updatedSearches = [
      query,
      ...recentSearches.filter(s => s !== query)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem("quranRecentSearches", JSON.stringify(updatedSearches));
  };
  
  const handleSearch = async (query?: string) => {
    const queryToUse = query || searchQuery;
    
    if (!queryToUse.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      const results = await fetchSearchResults(queryToUse);
      console.log(`Found ${results.length} results for "${queryToUse}"`);
      setSearchResults(results);
      
      if (results.length > 0) {
        addToRecentSearches(queryToUse);
      }
      
      // Update expanded terms for search filters display
      import('@/utils/searchUtils').then(({ expandSearchTerms }) => {
        const terms = expandSearchTerms(queryToUse);
        setExpandedTerms(terms);
      });
      
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  const navigateToVerse = (verse: Verse) => {
    // Save current scroll position
    const scrollPosition = resultsContainerRef.current?.scrollTop || 0;
    
    navigate(`/quran/reading?surah=${verse.surah}&verse=${verse.ayah}`, {
      state: {
        fromSearch: true,
        lastQuery: searchQuery,
        results: searchResults,
        scrollPosition
      }
    });
  };
  
  return (
    <div className="min-h-screen bg-app-background pb-20">
      <Header showBack={false} />
      
      <main className="max-w-screen-md mx-auto space-y-6 py-4">
        <div className="px-6 flex items-center space-x-3">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Explore Quran</h1>
            <p className="text-app-text-secondary">Search verses by keywords</p>
          </div>
        </div>
        
        <div className="px-6">
          <SearchBar 
            query={searchQuery}
            setQuery={setSearchQuery}
            handleSearch={handleSearch}
            isSearching={isSearching}
            isInitializing={isInitializing}
            recentSearches={recentSearches}
          />
          
          <div className="mt-3">
            <SearchFilters
              expandedTerms={expandedTerms}
              query={searchQuery}
            />
          </div>
        </div>
        
        {isSearching && (
          <div className="px-6">
            <SearchLoadingIndicator loadingProgress={75} />
          </div>
        )}
        
        <div 
          className="px-6 pb-4 overflow-y-auto"
          ref={resultsContainerRef}
        >
          <SearchResults
            results={searchResults}
            isSearching={isSearching}
            query={searchQuery}
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

export default QuranExplore;
