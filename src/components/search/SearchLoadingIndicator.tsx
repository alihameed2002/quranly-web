
import { Database } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SearchLoadingIndicatorProps {
  loadingProgress: number;
}

const SearchLoadingIndicator = ({ loadingProgress }: SearchLoadingIndicatorProps) => {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Database className="h-4 w-4 text-app-green" />
        <span className="text-sm font-medium text-white">Loading Quran database</span>
      </div>
      <Progress 
        value={loadingProgress} 
        className="h-2 bg-white/10" 
      />
      <p className="text-xs mt-2 text-app-text-secondary">
        Loading all 114 chapters for comprehensive search. This might take a moment...
      </p>
    </div>
  );
};

export default SearchLoadingIndicator;
