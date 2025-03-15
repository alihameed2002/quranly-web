
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Search, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import VerseCard from "@/components/VerseCard";
import { useNavigate } from "react-router-dom";
import { fetchSearchResults, extendedSampleVerses } from "@/utils/quranData";
import { Verse } from "@/utils/quranData";
import { searchVerses, expandSearchTerms } from "@/utils/searchUtils";
import { Input } from "@/components/ui/input";

const Explore = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Verse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedTerms, setExpandedTerms] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // For debugging - run search on mount with a test query
  useEffect(() => {
    console.log("Explore component mounted, ready for search");
  }, []);
  
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
      
      // Use direct search on our sample data for now (for quicker implementation)
      // In a real app, fetchSearchResults would call an API
      const searchResults = searchVerses(extendedSampleVerses, queryToUse);
      
      console.log(`Search completed with ${searchResults.length} results`);
      if (searchResults.length > 0) {
        console.log("First result:", searchResults[0]);
      }
      
      setResults(searchResults);
      
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
      
      <main className="max-w-screen-md mx-auto space-y-8 py-4">
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
          </div>
        </div>
        
        {expandedTerms.length > 0 && query.trim() && (
          <div className="px-6">
            <div className="flex items-center gap-1 text-xs text-app-text-secondary">
              <Info className="h-3 w-3" />
              <span>Also searching for related terms:</span>
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
            <div className="space-y-6">
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
      </main>
      
      <Navigation />
    </div>
  );
};

export default Explore;
