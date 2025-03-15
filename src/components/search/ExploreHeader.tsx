
import { Search } from "lucide-react";

interface ExploreHeaderProps {
  isInitializing: boolean;
  loadingProgress: number;
  totalVerses: number;
}

const ExploreHeader = ({ isInitializing, loadingProgress, totalVerses }: ExploreHeaderProps) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
        <Search className="h-6 w-6 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-white">Explore Quran</h1>
        <p className="text-app-text-secondary">
          {isInitializing 
            ? `Loading search database (${Math.round(loadingProgress)}%)...` 
            : totalVerses > 0 
              ? `Search across ${totalVerses.toLocaleString()} verses` 
              : "Search for verses by keyword"}
        </p>
      </div>
    </div>
  );
};

export default ExploreHeader;
