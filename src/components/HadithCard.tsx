import { useState } from "react";
import { Hadith } from "@/utils/hadithTypes";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenText, Bookmark, Share, ChevronsUp, ChevronsDown } from "lucide-react";

interface HadithCardProps {
  hadith: Hadith;
  onClick?: (hadith: Hadith) => void;
  showBookmark?: boolean;
  showShare?: boolean;
  isExpanded?: boolean;
}

const HadithCard = ({
  hadith,
  onClick,
  showBookmark = true,
  showShare = true,
  isExpanded = false,
}: HadithCardProps) => {
  const [expanded, setExpanded] = useState(isExpanded);

  const handleClick = () => {
    if (onClick) {
      onClick(hadith);
    }
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <Card 
      className="bg-app-background-dark border-white/10 rounded-lg mb-4 hover:border-white/30 transition"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center mb-2">
            <BookOpenText className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm font-medium text-primary">{hadith.reference}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-6 w-6"
            onClick={handleToggleExpand}
            aria-label={expanded ? "Collapse hadith" : "Expand hadith"}
          >
            {expanded ? (
              <ChevronsUp className="h-4 w-4 text-white/70" />
            ) : (
              <ChevronsDown className="h-4 w-4 text-white/70" />
            )}
          </Button>
        </div>

        {hadith.narrator && (
          <p className="text-sm font-medium text-green-500 mb-2">
            {hadith.narrator}
          </p>
        )}

        {expanded && hadith.arabic && (
          <div className="py-2 mb-3 font-arabic text-lg text-end text-white">
            {hadith.arabic}
          </div>
        )}

        <p className="text-white">{hadith.english}</p>

        {hadith.grade && (
          <p className="text-xs text-orange-400 mt-2">
            Grade: {hadith.grade}
          </p>
        )}
      </CardContent>

      {(showBookmark || showShare) && (
        <CardFooter className="px-4 py-2 border-t border-white/10 flex justify-end gap-2">
          {showBookmark && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
          {showShare && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default HadithCard;
