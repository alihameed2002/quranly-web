
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchFiltersProps {
  expandedTerms: string[];
  onExpandTerm?: (term: string) => void;
  onCollapseTerm?: (term: string) => void;
  query?: string;
  className?: string;
  currentCollection?: string;
  collectionsOptions?: { id: string; name: string; }[];
  onCollectionChange?: (collectionId: string) => Promise<void>;
}

export default function SearchFilters({ 
  expandedTerms, 
  onExpandTerm, 
  onCollapseTerm,
  query = "", 
  className,
  currentCollection,
  collectionsOptions = [],
  onCollectionChange
}: SearchFiltersProps) {
  const [showAllFilters, setShowAllFilters] = useState(false);
  
  const toggleTerm = (term: string) => {
    if (expandedTerms.includes(term)) {
      onCollapseTerm?.(term);
    } else {
      onExpandTerm?.(term);
    }
  };
  
  const isTermExpanded = (term: string) => expandedTerms.includes(term);
  
  const filters = [
    { id: "collection", name: "Collection" },
    { id: "book", name: "Book" },
    { id: "narrator", name: "Narrator" },
    { id: "topic", name: "Topic" },
    { id: "grade", name: "Grade" }
  ];
  
  const visibleFilters = showAllFilters ? filters : filters.slice(0, 3);
  
  return (
    <div className={cn("px-6 space-y-2", className)}>
      {query && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-app-text-secondary mb-1">Current Search</h3>
          <div className="glass-card rounded-lg px-3 py-2">
            <p className="text-white">{query}</p>
          </div>
        </div>
      )}
      
      {currentCollection && collectionsOptions && collectionsOptions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-app-text-secondary mb-1">Collection</h3>
          <div className="glass-card rounded-lg px-3 py-2">
            <select 
              className="w-full bg-transparent text-white outline-none"
              value={currentCollection}
              onChange={(e) => onCollectionChange?.(e.target.value)}
            >
              {collectionsOptions.map(option => (
                <option key={option.id} value={option.id} className="bg-app-background-dark">
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      <h3 className="text-sm font-medium text-app-text-secondary">Filters</h3>
      
      <div className="space-y-2">
        {visibleFilters.map((filter) => (
          <div key={filter.id} className="glass-card rounded-lg overflow-hidden">
            <button
              onClick={() => toggleTerm(filter.id)}
              className="w-full px-4 py-3 flex justify-between items-center"
            >
              <span className="text-white">{filter.name}</span>
              {isTermExpanded(filter.id) ? (
                <ChevronUp className="h-4 w-4 text-app-text-secondary" />
              ) : (
                <ChevronDown className="h-4 w-4 text-app-text-secondary" />
              )}
            </button>
            
            {isTermExpanded(filter.id) && (
              <div className="px-4 py-3 border-t border-white/10">
                <p className="text-app-text-secondary text-sm">
                  Filter options for {filter.name} would appear here.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {filters.length > 3 && (
        <button
          onClick={() => setShowAllFilters(!showAllFilters)}
          className="text-sm text-app-green flex items-center"
        >
          {showAllFilters ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              Show less filters
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              Show all filters
            </>
          )}
        </button>
      )}
    </div>
  );
}
