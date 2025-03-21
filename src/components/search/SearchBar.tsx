import { useState, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import debounce from 'lodash/debounce';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  handleSearch: (searchQuery?: string) => void;
  isSearching: boolean;
  isInitializing: boolean;
  recentSearches: string[];
}

const SearchBar = ({
  query,
  setQuery,
  handleSearch,
  isSearching,
  isInitializing,
  recentSearches
}: SearchBarProps) => {
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      if (searchTerm.trim().length >= 2) {
        handleSearch(searchTerm);
      }
    }, 600),
    [handleSearch]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (newQuery.length >= 2) {
      debouncedSearch(newQuery);
    } else if (newQuery.length === 0) {
      // Clear search results if query is empty
      debouncedSearch.cancel();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      debouncedSearch.cancel();
      handleSearch();
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 space-y-4">
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search by keywords, phrases, or topics..."
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
  );
};

export default SearchBar;
