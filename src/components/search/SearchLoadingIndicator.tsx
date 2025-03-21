import { Database, Search } from "lucide-react";

interface SearchLoadingIndicatorProps {
  query: string;
}

const SearchLoadingIndicator = ({ query }: SearchLoadingIndicatorProps) => {
  return (
    <div className="glass-card rounded-xl p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="h-8 w-8 border-4 border-app-green border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="flex items-center gap-2 justify-center mb-2">
          <Search className="h-4 w-4 text-app-green" />
          <span className="text-sm font-medium text-white">Comprehensive Search</span>
        </div>
        <p className="text-xs text-app-text-secondary mb-1">
          Searching for "{query}" across all hadith collections
        </p>
        <p className="text-xs text-app-text-secondary opacity-75">
          Finding exact matches, related terms, and similar concepts
        </p>
      </div>
    </div>
  );
};

export default SearchLoadingIndicator;
