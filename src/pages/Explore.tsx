
import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import VerseCard from "@/components/VerseCard";
import { useNavigate } from "react-router-dom";
import { fetchSearchResults, Verse } from "@/utils/quranData";
import { toast } from "sonner";

const Explore = () => {
  const { toast: uiToast } = useToast();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Verse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = async () => {
    if (!query.trim()) {
      toast("Search query is empty", {
        description: "Please enter a keyword to search for",
      });
      return;
    }
    
    setIsSearching(true);
    try {
      console.log("Executing search for:", query);
      const searchResults = await fetchSearchResults(query);
      
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        toast("No results found", {
          description: `No verses found for "${query}"`,
        });
      } else {
        toast("Search completed", {
          description: `Found ${searchResults.length} results for "${query}"`,
        });
      }
    } catch (error) {
      console.error("Search failed:", error);
      toast("Search failed", {
        description: "An error occurred while searching. Please try again.",
      });
    } finally {
      setIsSearching(false);
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
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the Quran..."
                className="w-full h-12 bg-white/5 border border-white/10 rounded-lg px-4 pr-12 text-white"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
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
        
        {results.length > 0 && (
          <div className="px-6">
            <h2 className="text-xl font-semibold text-white mb-4">Search Results</h2>
            <div className="space-y-6">
              {results.map((result) => (
                <div 
                  key={result.id} 
                  className="glass-card rounded-xl p-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => navigate(`/reading?surah=${result.surah}&verse=${result.ayah}`)}
                >
                  <VerseCard
                    surahName={result.surahName || `Surah ${result.surah}`}
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
      </main>
      
      <Navigation />
    </div>
  );
};

export default Explore;
