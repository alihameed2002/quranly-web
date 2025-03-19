
import { cn } from "@/lib/utils";

export interface SearchLoadingIndicatorProps {
  loadingProgress?: number;
  className?: string;
  query?: string;
}

export default function SearchLoadingIndicator({ 
  loadingProgress = 0,
  className,
  query
}: SearchLoadingIndicatorProps) {
  const progressWidth = `${loadingProgress}%`;
  
  return (
    <div className={cn("w-full px-6 py-2", className)}>
      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-center">
          <p className="text-xs text-app-text-secondary">Loading results{query ? ` for "${query}"` : ''}...</p>
          <span className="text-xs text-app-text-secondary">{loadingProgress}%</span>
        </div>
        <div className="w-full h-1 bg-app-background-light rounded-full overflow-hidden">
          <div 
            className="h-full bg-app-green transition-all duration-300 rounded-full" 
            style={{ width: progressWidth }}
          ></div>
        </div>
      </div>
    </div>
  );
}
