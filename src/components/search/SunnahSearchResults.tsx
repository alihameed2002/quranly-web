
import HadithCard from "@/components/HadithCard";
import { Hadith } from "@/utils/hadithTypes";

interface SunnahSearchResultsProps {
  results: Hadith[];
  query: string;
  onResultClick: (hadith: Hadith) => void;
}

const SunnahSearchResults = ({
  results,
  query,
  onResultClick
}: SunnahSearchResultsProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">
        Search Results ({results.length})
      </h2>
      <div className="space-y-4">
        {results.map((result, index) => (
          <HadithCard
            key={`${result.collection}-${result.bookNumber}-${result.hadithNumber}-${index}`}
            hadith={result}
            onClick={onResultClick}
            showBookmark={false}
            showShare={false}
          />
        ))}
      </div>
    </div>
  );
};

export default SunnahSearchResults;
