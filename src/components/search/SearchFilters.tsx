import { Info } from "lucide-react";

interface SearchFiltersProps {
  expandedTerms: string[];
  currentCollection: string;
  collectionsOptions: {id: string, name: string}[];
  onCollectionChange?: (collectionId: string) => Promise<void>;
}

const SearchFilters = ({ 
  expandedTerms, 
  currentCollection, 
  collectionsOptions, 
  onCollectionChange 
}: SearchFiltersProps) => {
  if (expandedTerms.length === 0) {
    return null;
  }
  
  return (
    <div>
      <div className="flex items-center gap-1 text-xs text-app-text-secondary">
        <Info className="h-3 w-3" />
        <span>Search includes related terms:</span>
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
      
      {collectionsOptions.length > 1 && onCollectionChange && (
        <div className="mt-4">
          <div className="text-sm text-white mb-2">Collection:</div>
          <div className="flex flex-wrap gap-2">
            {collectionsOptions.map(option => (
              <button
                key={option.id}
                className={`px-3 py-1 text-sm rounded-full transition ${
                  currentCollection === option.id
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                onClick={() => onCollectionChange(option.id)}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
