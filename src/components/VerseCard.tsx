import { Share, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface VerseCardProps {
  surahName: string;
  surahNumber: number;
  verseNumber: number;
  totalVerses: number;
  arabicText: string;
  translation: string;
  className?: string;
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
  minimized = false
}: VerseCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Bookmark added",
      description: `${surahName} (${surahNumber}:${verseNumber})`,
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
        <div className="flex flex-col mb-2">
          <h3 className="text-white font-medium">{surahName}</h3>
          <p className="text-app-text-secondary text-sm">Surah {surahNumber} : Ayah {verseNumber}</p>
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
