
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
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
import { bukhariCategories } from '@/utils/bukhari-categories';

interface BukhariBookSelectorProps {
  currentBook: string;
  currentHadith: string;
  onSelectBook: (bookId: string) => void;
  onSelectHadith: (hadithNumber: string) => void;
}

export default function BukhariBookSelector({
  currentBook,
  currentHadith,
  onSelectBook,
  onSelectHadith
}: BukhariBookSelectorProps) {
  const [currentBookName, setCurrentBookName] = useState('');
  
  // Find the current book name
  useEffect(() => {
    const category = bukhariCategories.find(cat => cat.id === currentBook);
    if (category) {
      setCurrentBookName(category.name);
    } else {
      setCurrentBookName(`Book ${currentBook}`);
    }
  }, [currentBook]);
  
  // Generate hadith number ranges for the current book
  const getHadithSubMenuItems = (category: typeof bukhariCategories[0]) => {
    const [start, end] = category.range;
    const items = [];
    
    // Create groups of 10 hadiths for better organization
    const step = 10;
    for (let i = start; i <= end; i += step) {
      const rangeEnd = Math.min(i + step - 1, end);
      
      if (end - start < 20) {
        // For smaller books, show individual hadiths
        for (let j = i; j <= rangeEnd; j++) {
          items.push(
            <DropdownMenuItem 
              key={`hadith-${j}`}
              onClick={() => onSelectHadith(j.toString())}
            >
              Hadith {j}
            </DropdownMenuItem>
          );
        }
      } else {
        // For larger books, show ranges
        items.push(
          <DropdownMenuSub key={`range-${i}`}>
            <DropdownMenuSubTrigger>
              Hadith {i}-{rangeEnd}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-app-background-dark border-app-border">
                {Array.from({ length: rangeEnd - i + 1 }).map((_, index) => {
                  const hadithNumber = i + index;
                  return (
                    <DropdownMenuItem 
                      key={`hadith-${hadithNumber}`}
                      onClick={() => onSelectHadith(hadithNumber.toString())}
                    >
                      Hadith {hadithNumber}
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
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center glass-card rounded-lg px-4 py-2 text-white border border-app-border hover:bg-white/5">
        <span className="mr-2 truncate max-w-[200px]">
          {currentBookName} - Hadith {currentHadith}
        </span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        className="max-h-[400px] overflow-y-auto w-[300px] bg-app-background-dark border-app-border text-white"
      >
        <DropdownMenuLabel>Select Book & Hadith</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-app-border" />
        
        <DropdownMenuGroup>
          {bukhariCategories.map((category) => (
            <DropdownMenuSub key={category.id}>
              <DropdownMenuSubTrigger
                className={currentBook === category.id ? "bg-white/10" : ""}
              >
                {category.name}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-app-background-dark border-app-border">
                  <DropdownMenuItem 
                    onClick={() => {
                      onSelectBook(category.id);
                      onSelectHadith(category.range[0].toString());
                    }}
                  >
                    First Hadith ({category.range[0]})
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-app-border" />
                  {getHadithSubMenuItems(category)}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
