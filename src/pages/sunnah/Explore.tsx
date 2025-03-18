
import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Search, Compass, Globe } from "lucide-react";
import { searchHadith } from "@/utils/hadithData";
import { Hadith } from "@/utils/hadithTypes";
import SearchBar from "@/components/search/SearchBar";
import SearchFilters from "@/components/search/SearchFilters";
import SearchLoadingIndicator from "@/components/search/SearchLoadingIndicator";
import SunnahSearchResults from "@/components/search/SunnahSearchResults";
import HadithChapterBrowser from "@/components/HadithChapterBrowser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SunnahExplore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Hadith[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [expandedTerms, setExpandedTerms] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("browse"); // Default to browse tab
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
        setActiveTab("search");
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
    const savedSearches = localStorage.getItem("sunnahRecentSearches");
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
    localStorage.setItem("sunnahRecentSearches", JSON.stringify(updatedSearches));
  };
  
  const handleSearch = async (query?: string) => {
    const queryToUse = query || searchQuery;
    
    if (!queryToUse.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    setActiveTab("search");
    
    try {
      const results = await searchHadith(queryToUse);
      console.log(`Found ${results.length} results for "${queryToUse}"`);
      setSearchResults(results);
      
      if (results.length > 0) {
        addToRecentSearches(queryToUse);
      }
      
      // Update expanded terms for search filters display
      import('@/utils/searchUtils').then(({ expandSearchTerms }) => {
        const terms = expandSearchTerms(queryToUse);
        setExpandedTerms(terms);
      }).catch(err => {
        console.error("Error importing searchUtils:", err);
        setExpandedTerms(queryToUse.split(' '));
      });
      
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
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Explore Sunnah</h1>
            <p className="text-app-text-secondary">Browse and search Sahih Bukhari</p>
          </div>
        </div>
        
        <div className="px-6">
          <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="glass-card w-full mb-4 bg-white/5">
              <TabsTrigger value="search" className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                Search
              </TabsTrigger>
              <TabsTrigger value="browse" className="flex-1">
                <Compass className="h-4 w-4 mr-2" />
                Browse
              </TabsTrigger>
              <TabsTrigger value="collections" className="flex-1">
                <Globe className="h-4 w-4 mr-2" />
                Collections
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="space-y-4">
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
              
              {isSearching && (
                <SearchLoadingIndicator loadingProgress={75} />
              )}
              
              <div 
                className="pb-4 overflow-y-auto"
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
            </TabsContent>
            
            <TabsContent value="browse">
              <HadithChapterBrowser />
            </TabsContent>
            
            <TabsContent value="collections">
              <div className="glass-card rounded-lg p-6">
                <h2 className="text-lg font-medium text-white mb-4">Hadith Collections</h2>
                <div className="space-y-3">
                  {[
                    { name: "Sahih Bukhari", available: true },
                    { name: "Sahih Muslim", available: false },
                    { name: "Sunan Abu Dawood", available: false },
                    { name: "Jami at-Tirmidhi", available: false },
                    { name: "Sunan an-Nasa'i", available: false },
                    { name: "Sunan Ibn Majah", available: false },
                    { name: "Muwatta Malik", available: false },
                    { name: "Musnad Ahmad", available: false },
                    { name: "Sunan al-Darimi", available: false }
                  ].map((collection, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg flex items-center justify-between ${
                        collection.available ? 'glass-card hover:bg-white/5 cursor-pointer' : 'bg-white/5 opacity-60'
                      }`}
                      onClick={() => collection.available && setActiveTab("browse")}
                    >
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-app-green" />
                        <span className="text-white">{collection.name}</span>
                      </div>
                      {!collection.available && (
                        <span className="text-app-text-secondary text-xs">Coming soon</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default SunnahExplore;
