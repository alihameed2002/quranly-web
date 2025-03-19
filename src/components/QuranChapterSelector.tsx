
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { fetchSurahs, Surah } from '@/utils/quranData';

interface QuranChapterSelectorProps {
  currentSurah: number;
  currentVerse: number;
  onSelectSurah: (surahNumber: number) => void;
  onSelectVerse: (verseNumber: number) => void;
}

export default function QuranChapterSelector({
  currentSurah,
  currentVerse,
  onSelectSurah,
  onSelectVerse
}: QuranChapterSelectorProps) {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [currentSurahData, setCurrentSurahData] = useState<Surah | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load all surahs
  useEffect(() => {
    const loadSurahs = async () => {
      setIsLoading(true);
      try {
        const surahsData = await fetchSurahs();
        setSurahs(surahsData);
        
        // Find current surah data
        const surahData = surahsData.find(s => s.id === currentSurah);
        if (surahData) {
          setCurrentSurahData(surahData);
        }
      } catch (error) {
        console.error("Failed to load surahs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSurahs();
  }, [currentSurah]);
  
  // Generate verse sub-menu items for a surah
  const getVerseSubMenuItems = (surah: Surah) => {
    const totalVerses = surah.numberOfAyahs;
    const items = [];
    
    // Create groups of 10 verses for better organization
    const step = 10;
    for (let i = 1; i <= totalVerses; i += step) {
      const rangeEnd = Math.min(i + step - 1, totalVerses);
      
      if (totalVerses < 20) {
        // For smaller surahs, show individual verses
        for (let j = i; j <= rangeEnd; j++) {
          items.push(
            <DropdownMenuItem 
              key={`verse-${j}`}
              onClick={() => onSelectVerse(j)}
            >
              Verse {j}
            </DropdownMenuItem>
          );
        }
      } else {
        // For larger surahs, show ranges
        items.push(
          <DropdownMenuSub key={`range-${i}`}>
            <DropdownMenuSubTrigger>
              Verses {i}-{rangeEnd}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-app-background-dark border-app-border">
                {Array.from({ length: rangeEnd - i + 1 }).map((_, index) => {
                  const verseNumber = i + index;
                  return (
                    <DropdownMenuItem 
                      key={`verse-${verseNumber}`}
                      onClick={() => onSelectVerse(verseNumber)}
                    >
                      Verse {verseNumber}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        );
      }
    }
    
    return items;
  };
  
  const getDisplayName = () => {
    if (!currentSurahData) return `Surah ${currentSurah} - Verse ${currentVerse}`;
    return `${currentSurahData.englishName} - Verse ${currentVerse}`;
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center glass-card rounded-lg px-4 py-2 text-white border border-app-border hover:bg-white/5">
        <span className="mr-2 truncate max-w-[200px]">
          {getDisplayName()}
        </span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        className="max-h-[400px] overflow-y-auto w-[300px] bg-app-background-dark border-app-border text-white"
      >
        <DropdownMenuLabel>Select Surah & Verse</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-app-border" />
        
        <DropdownMenuGroup>
          {surahs.map((surah) => (
            <DropdownMenuSub key={surah.id}>
              <DropdownMenuSubTrigger
                className={currentSurah === surah.id ? "bg-white/10" : ""}
              >
                {surah.id}. {surah.englishName}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-app-background-dark border-app-border">
                  <DropdownMenuItem 
                    onClick={() => {
                      onSelectSurah(surah.id);
                      onSelectVerse(1);
                    }}
                  >
                    First Verse
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-app-border" />
                  {getVerseSubMenuItems(surah)}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
