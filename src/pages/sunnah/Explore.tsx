import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Search, Compass } from "lucide-react";
import { 
  searchHadiths, 
  getBooks, 
  loadCollection,
  COLLECTION_MAP 
} from "@/utils/hadithDatabase";
import { Hadith } from "@/utils/hadithTypes";
import SearchBar from "@/components/search/SearchBar";
import SearchFilters from "@/components/search/SearchFilters";
import SearchLoadingIndicator from "@/components/search/SearchLoadingIndicator";
import SunnahSearchResults from "@/components/search/SunnahSearchResults";
import HadithChapterBrowser from "@/components/HadithChapterBrowser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { expandSearchTerms } from "@/utils/searchUtils";

const SunnahExplore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Hadith[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [expandedTerms, setExpandedTerms] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("browse"); // Default to browse tab
  const [isLoadingCollection, setIsLoadingCollection] = useState(false);
  
  // Always use Bukhari as the only collection
  const activeCollection = "bukhari";
  
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Initialize the search system
    const initializeSearch = async () => {
      try {
        setIsInitializing(true);
        // Load the Bukhari collection to ensure it's available
        await loadCollection("bukhari");
        
        // Check if we're coming back from a hadith with search results
        if (location.state?.fromSearch) {
          setSearchQuery(location.state.lastQuery || "");
          if (location.state.results) {
            setSearchResults(location.state.results);
            setActiveTab("search");
            
            // Restore scroll position if available
            if (location.state.scrollPosition && resultsContainerRef.current) {
              setTimeout(() => {
                if (resultsContainerRef.current) {
                  resultsContainerRef.current.scrollTop = location.state.scrollPosition;
                }
              }, 0);
            }
          }
        }
        
        // Load recent searches from localStorage
        const storedSearches = localStorage.getItem("recentHadithSearches");
        if (storedSearches) {
          try {
            setRecentSearches(JSON.parse(storedSearches));
          } catch (error) {
            console.error("Failed to parse recent searches:", error);
          }
        }
      } catch (error) {
        console.error("Error initializing search:", error);
        toast({
          title: "Error",
          description: "Failed to initialize search. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeSearch();
  }, [location, toast]);
  
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    setActiveTab("search");
    
    try {
      // Add to recent searches
      const newRecentSearches = [
        query,
        ...recentSearches.filter(s => s !== query)
      ].slice(0, 5);
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem("recentHadithSearches", JSON.stringify(newRecentSearches));
      
      // Set expanded terms for filters
      const terms = expandSearchTerms(query);
      setExpandedTerms(terms);
      
      // Perform search
      const results = await searchHadiths(query, [activeCollection]);
      setSearchResults(results);
      
      // Scroll to top of results
      if (resultsContainerRef.current) {
        resultsContainerRef.current.scrollTop = 0;
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: "An error occurred while searching. Please try again.",
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
            <p className="text-app-text-secondary">Browse and search authentic hadith from Sahih al-Bukhari</p>
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
                  currentCollection={activeCollection}
                  collectionsOptions={[{id: 'bukhari', name: 'Sahih al-Bukhari'}]}
                />
              </div>
              
              <div ref={resultsContainerRef} className="overflow-y-auto max-h-[calc(100vh-300px)]">
                {isSearching ? (
                  <SearchLoadingIndicator query={searchQuery} />
                ) : (
                  searchResults.length > 0 ? (
                    <SunnahSearchResults 
                      results={searchResults} 
                      onResultClick={navigateToHadith}
                      query={searchQuery}
                    />
                  ) : searchQuery.trim() ? (
                    <div className="text-center py-12 text-app-text-secondary">
                      No results found for "{searchQuery}"
                    </div>
                  ) : (
                    <div className="text-center py-12 text-app-text-secondary">
                      Enter a search query to find hadiths
                    </div>
                  )
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="browse">
              <HadithChapterBrowser 
                collectionId={activeCollection}
                onHadithClick={navigateToHadith}
                isLoading={isLoadingCollection}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default SunnahExplore;
