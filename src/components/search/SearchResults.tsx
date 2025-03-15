import { Search } from "lucide-react";
import VerseCard from "@/components/VerseCard";
import { Verse } from "@/utils/quranData";

interface SearchResultsProps {
  results: Verse[];
  isSearching: boolean;
  query: string;
  isInitializing: boolean;
  navigateToVerse: (verse: Verse) => void;
  handleSearch: (searchQuery: string) => void;
}

const SearchResults = ({
  results,
  isSearching,
  query,
  isInitializing,
  navigateToVerse,
  handleSearch
}: SearchResultsProps) => {
  
  // If there are results, display them
  if (results.length > 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          Search Results ({results.length})
        </h2>
        <div className="space-y-4">
          {results.map((result, index) => {
            // Ensure we have valid surah number
            const surahNumber = result.surah > 0 ? result.surah : index + 1;
            
            return (
              <div 
                key={`${surahNumber}-${result.ayah || index}-${index}`}
                className="glass-card rounded-xl p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => navigateToVerse(result)}
              >
                <VerseCard
                  surahName={result.surahName || `Surah ${surahNumber}`}
                  surahNumber={surahNumber}
                  verseNumber={result.ayah || 0}
                  totalVerses={result.totalVerses || 0}
                  arabicText={result.arabic || ""}
                  translation={result.translation || ""}
                  minimized={true}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  // If there's a query but no results and not currently searching
  if (query && !isSearching && results.length === 0 && !isInitializing) {
    return (
      <div className="py-10 text-center">
        <div className="text-app-text-secondary">
          <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-lg">No results found for "{query}"</p>
          <p className="mt-2 text-sm opacity-70">
            Try using different keywords or more general terms
          </p>
        </div>
      </div>
    );
  }
  
  // Default state - no query, show examples
  if (!query && results.length === 0 && !isSearching && !isInitializing) {
    return (
      <div className="mt-8">
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
                onClick={() => handleSearch(example)}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-app-text-secondary transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default SearchResults;
