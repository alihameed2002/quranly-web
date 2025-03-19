
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchFiltersProps {
  expandedTerms: string[];
  query?: string; // Making query optional
}

// Mock component for search filters
// This would be expanded with actual filter options in a real implementation
const SearchFilters = ({ expandedTerms, query }: SearchFiltersProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div className="glass-card rounded-lg overflow-hidden">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="text-white font-medium">Filters</div>
        <ChevronRight className={cn(
          "h-5 w-5 text-app-text-secondary transition-transform",
          expanded && "rotate-90"
        )} />
      </div>
      
      {expanded && (
        <div className="p-4 pt-0 border-t border-white/10">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-app-text-secondary mb-2">Collections</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="bukhari" className="mr-2 h-4 w-4" defaultChecked />
                  <label htmlFor="bukhari" className="text-white text-sm">Sahih Bukhari</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="muslim" className="mr-2 h-4 w-4" defaultChecked />
                  <label htmlFor="muslim" className="text-white text-sm">Sahih Muslim</label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm text-app-text-secondary mb-2">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="prayer" className="mr-2 h-4 w-4" defaultChecked />
                  <label htmlFor="prayer" className="text-white text-sm">Prayer</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="fasting" className="mr-2 h-4 w-4" defaultChecked />
                  <label htmlFor="fasting" className="text-white text-sm">Fasting</label>
                </div>
              </div>
            </div>
            
            {query && expandedTerms.length > 0 && (
              <div>
                <h3 className="text-sm text-app-text-secondary mb-2">Related Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {expandedTerms.map((term, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-white/10 rounded-full text-xs text-white"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>  
      )}
    </div>
  );
};

export default SearchFilters;
