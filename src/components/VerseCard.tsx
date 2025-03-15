
import { Share, Bookmark, Heart, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRecitation } from "@/hooks/useRecitation";
import { useToast } from "@/hooks/use-toast";

interface VerseCardProps {
  surahName: string;
  surahNumber: number;
  verseNumber: number;
  totalVerses: number;
  arabicText: string;
  translation: string;
  className?: string;
  likes?: number;
  minimized?: boolean;
}

export default function VerseCard({
  surahName,
  surahNumber,
  verseNumber,
  totalVerses,
  arabicText,
  translation,
  className,
  likes = 3100,
  minimized = false
}: VerseCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const formattedLikes = likes / 1000;
  const { toast } = useToast();
  const { isPlaying, togglePlay } = useRecitation({ 
    surahId: surahNumber, 
    verseId: verseNumber 
  });

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Bookmark added",
      description: `${surahName} (${surahNumber}:${verseNumber})`,
    });
  };
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast({
      description: isLiked ? "Removed from favorites" : "Added to favorites",
    });
  };

  const handleShare = () => {
    // In a real app, this would use the Web Share API
    toast({
      title: "Sharing verse",
      description: `${surahName} (${surahNumber}:${verseNumber})`,
    });
  };

  if (minimized) {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex justify-between mb-2">
          <div>
            <h3 className="text-white font-medium">{surahNumber}. {surahName}</h3>
            <p className="text-app-text-secondary text-sm">{verseNumber}/{totalVerses}</p>
          </div>
          <button 
            className="h-8 w-8 rounded-full flex items-center justify-center glass-card"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
          >
            <Volume2 className="h-4 w-4 text-white" />
          </button>
        </div>
        <div className="text-right mb-2 text-lg font-arabic text-white" dir="rtl">
          {arabicText.length > 100 ? arabicText.substring(0, 100) + '...' : arabicText}
        </div>
        <div className="text-app-text-secondary text-sm">
          {translation.length > 120 ? translation.substring(0, 120) + '...' : translation}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-4 animate-fade-in", className)}>
      <div className="flex items-center gap-3 px-6">
        <button 
          className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center glass-card hover:bg-white/10 transition-all duration-300",
            isPlaying ? "bg-app-green/20" : ""
          )}
          onClick={togglePlay}
        >
          <Volume2 className={cn(
            "h-5 w-5",
            isPlaying ? "text-app-green" : "text-white"
          )} />
        </button>
        
        <div className="flex-1 text-center">
          <h2 className="text-lg font-medium text-white">
            {surahNumber}. {surahName}
          </h2>
          <p className="text-sm text-app-text-secondary">
            {verseNumber}/{totalVerses}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleLike}
            className="h-10 w-10 rounded-full flex items-center justify-center glass-card hover:bg-white/10 transition-all duration-300"
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-all duration-300",
                isLiked ? "text-pink-500 fill-pink-500" : "text-white"
              )} 
            />
          </button>
          
          <div className="text-sm text-app-text-secondary">
            {formattedLikes}K
          </div>
          
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
          {arabicText}
        </div>
        
        <button 
          onClick={handleShare}
          className="h-10 w-10 rounded-full flex items-center justify-center glass-card hover:bg-white/10 transition-all duration-300 mx-auto"
        >
          <Share className="h-5 w-5 text-white" />
        </button>
      </div>
      
      <div className="px-4 py-6 text-lg text-app-text-secondary">
        {translation}
      </div>
    </div>
  );
}
