
import { Share, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Hadith } from "@/utils/hadithTypes";

interface HadithCardProps {
  hadith: Hadith;
  className?: string;
  minimized?: boolean;
  onClick?: () => void;
}

export default function HadithCard({
  hadith,
  className,
  minimized = false,
  onClick
}: HadithCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Bookmark added",
      description: `${hadith.collection} (${hadith.bookNumber}:${hadith.hadithNumber})`,
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create share URL
    const shareUrl = `/sunnah/reading?collection=${encodeURIComponent(hadith.collection)}&book=${hadith.bookNumber}&hadith=${hadith.hadithNumber}`;
    
    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: `${hadith.collection} (${hadith.bookNumber}:${hadith.hadithNumber})`,
        text: hadith.english.substring(0, 100) + '...',
        url: window.location.origin + shareUrl,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.origin + shareUrl)
        .then(() => {
          toast({
            title: "Link copied to clipboard",
            description: `${hadith.collection} (${hadith.bookNumber}:${hadith.hadithNumber})`,
          });
        })
        .catch((error) => {
          console.error('Could not copy link: ', error);
          toast({
            title: "Sharing hadith",
            description: `${hadith.collection} (${hadith.bookNumber}:${hadith.hadithNumber})`,
          });
        });
    }
  };

  // Format the book name for display
  const getBookName = () => {
    return `Book ${hadith.bookNumber}`;
  };

  if (minimized) {
    return (
      <div 
        className={cn("w-full cursor-pointer", className)}
        onClick={onClick}
      >
        <div className="flex flex-col mb-2">
          <h3 className="text-white font-medium">{hadith.collection}</h3>
          <p className="text-app-text-secondary text-sm">
            Book {hadith.bookNumber} : Hadith {hadith.hadithNumber}
            {hadith.narrator && ` • ${hadith.narrator}`}
          </p>
        </div>
        <div className="text-right mb-2 text-lg font-arabic text-white" dir="rtl">
          {hadith.arabic.length > 100 ? hadith.arabic.substring(0, 100) + '...' : hadith.arabic}
        </div>
        <div className="text-app-text-secondary text-sm">
          {hadith.english.length > 120 ? hadith.english.substring(0, 120) + '...' : hadith.english}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-4 animate-fade-in", className)}>
      <div className="flex items-center gap-3 px-6">
        <div className="flex-1">
          <h2 className="text-lg font-medium text-white">
            {hadith.collection}
          </h2>
          <p className="text-sm text-app-text-secondary">
            {getBookName()}
          </p>
          <p className="text-sm text-app-green">
            Hadith #{hadith.hadithNumber}
            {hadith.narrator && ` • Narrated by ${hadith.narrator}`}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleBookmark}
            className="h-10 w-10 rounded-full flex items-center justify-center glass-card hover:bg-white/10 transition-all duration-300"
          >
            <Bookmark 
              className={cn(
                "h-5 w-5 transition-all duration-300",
                isBookmarked ? "text-app-green fill-app-green" : "text-white"
              )} 
            />
          </button>
        </div>
      </div>
      
      <div className="rounded-lg neo-blur p-6 space-y-6">
        <div dir="rtl" className="w-full text-right leading-loose font-arabic text-2xl">
          {hadith.arabic}
        </div>
        
        <button 
          onClick={handleShare}
          className="h-10 w-10 rounded-full flex items-center justify-center glass-card hover:bg-white/10 transition-all duration-300 mx-auto"
        >
          <Share className="h-5 w-5 text-white" />
        </button>
      </div>
      
      <div className="px-4 py-6 text-lg text-app-text-secondary">
        {hadith.english}
      </div>
      
      <div className="text-center text-sm text-app-text-secondary">
        <p>{hadith.reference}</p>
        {hadith.grade && <p className="text-app-green">{hadith.grade}</p>}
      </div>
    </div>
  );
}
