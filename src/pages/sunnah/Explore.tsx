
import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { BookText } from "lucide-react";
import { searchHadith } from "@/utils/hadithData";
import { Hadith } from "@/utils/hadithTypes";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchLoadingIndicator } from "@/components/search/SearchLoadingIndicator";
import SunnahSearchResults from "@/components/search/SunnahSearchResults";

const SunnahExplore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Hadith[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
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
    
    setIsInitializing(false);
  }, [location.state]);
  
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      const results = await searchHadith(query);
      console.log(`Found ${results.length} results for "${query}"`);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  const navigateToHadith = (hadith: Hadith) => {
    // Save current scroll position
    const scrollPosition = resultsContainerRef.current?.scrollTop || 0;
    
    navigate(`/sunnah/reading?collection=${encodeURIComponent(hadith.collection)}&book=${hadith.bookNumber}&hadith=${hadith.hadithNumber}`, {
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
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <BookText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Explore Sunnah</h1>
            <p className="text-app-text-secondary">Search hadith collections</p>
          </div>
        </div>
        
        <div className="px-6">
          <SearchBar 
            query={searchQuery}
            onSearch={handleSearch}
            placeholder="Search hadith..."
          />
          
          <SearchFilters />
        </div>
        
        {isSearching && (
          <SearchLoadingIndicator query={searchQuery} />
        )}
        
        <div 
          className="px-6 pb-4 overflow-y-auto"
          ref={resultsContainerRef}
        >
          <SunnahSearchResults
            results={searchResults}
            isSearching={isSearching}
            query={searchQuery}
            isInitializing={isInitializing}
            navigateToHadith={navigateToHadith}
            handleSearch={handleSearch}
          />
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default SunnahExplore;
