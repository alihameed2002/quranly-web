
import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Search, Compass, Globe } from "lucide-react";
import { searchHadith, loadHadithData } from "@/utils/hadithData";
import { fetchCollections } from "@/utils/the9BooksApi";
import { Hadith } from "@/utils/hadithTypes";
import SearchBar from "@/components/search/SearchBar";
import SearchFilters from "@/components/search/SearchFilters";
import SearchLoadingIndicator from "@/components/search/SearchLoadingIndicator";
import SunnahSearchResults from "@/components/search/SunnahSearchResults";
import HadithChapterBrowser from "@/components/HadithChapterBrowser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SunnahExplore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Hadith[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [expandedTerms, setExpandedTerms] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("browse"); // Default to browse tab
  const [collections, setCollections] = useState<{id: string, name: string}[]>([]);
  const [activeCollection, setActiveCollection] = useState("bukhari");
  const [isLoadingCollection, setIsLoadingCollection] = useState(false);
  
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Load collections on initial render
  useEffect(() => {
    const loadAvailableCollections = async () => {
      try {
        const fetchedCollections = await fetchCollections();
        setCollections(fetchedCollections);
      } catch (error) {
        console.error("Error loading collections:", error);
        toast({
          title: "Failed to load collections",
          description: "Using default Bukhari collection",
          variant: "destructive",
        });
      }
    };
    
    loadAvailableCollections();
  }, [toast]);
  
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
  
  const handleCollectionChange = async (collectionId: string) => {
    if (collectionId === activeCollection) return;
    
    setIsLoadingCollection(true);
    setActiveCollection(collectionId);
    
    try {
      await loadHadithData(collectionId, true);
      toast({
        title: "Collection Changed",
        description: `Now browsing ${collections.find(c => c.id === collectionId)?.name || collectionId}`,
      });
    } catch (error) {
      console.error(`Error loading collection ${collectionId}:`, error);
      toast({
        title: "Error Loading Collection",
        description: "Failed to load selected collection",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCollection(false);
    }
  };
  
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
      toast({
        title: "Search Error",
        description: "Failed to search hadith collection",
        variant: "destructive",
      });
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
            <p className="text-app-text-secondary">Browse and search authentic hadith collections</p>
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
            
            {/* Collection selector - visible in both browse and search tabs */}
            {(activeTab === "browse" || activeTab === "search") && (
              <div className="mb-4">
                <Select value={activeCollection} onValueChange={handleCollectionChange} disabled={isLoadingCollection}>
                  <SelectTrigger className="glass-card border-white/20 text-white">
                    <SelectValue placeholder="Select Collection" />
                  </SelectTrigger>
                  <SelectContent className="bg-app-background-dark border-white/20">
                    {collections.map(collection => (
                      <SelectItem 
                        key={collection.id} 
                        value={collection.id}
                        className="text-white hover:bg-white/10"
                      >
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isLoadingCollection && (
                  <p className="text-app-text-secondary text-sm mt-1 animate-pulse">Loading collection data...</p>
                )}
              </div>
            )}
            
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
              <HadithChapterBrowser collectionId={activeCollection} />
            </TabsContent>
            
            <TabsContent value="collections">
              <div className="glass-card rounded-lg p-6">
                <h2 className="text-lg font-medium text-white mb-4">Hadith Collections</h2>
                <div className="space-y-3">
                  {collections.length > 0 ? (
                    collections.map((collection, index) => (
                      <div 
                        key={collection.id}
                        className="p-4 rounded-lg flex items-center justify-between glass-card hover:bg-white/5 cursor-pointer"
                        onClick={() => {
                          handleCollectionChange(collection.id);
                          setActiveTab("browse");
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <BookOpen className="h-5 w-5 text-app-green" />
                          <span className="text-white">{collection.name}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-app-text-secondary py-6">
                      {isLoadingCollection ? (
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 border-4 border-app-green border-t-transparent rounded-full animate-spin mb-2"></div>
                          <p>Loading collections...</p>
                        </div>
                      ) : (
                        <p>No collections available</p>
                      )}
                    </div>
                  )}
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
