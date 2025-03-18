
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import HadithCard from "./HadithCard";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Hadith } from "@/utils/hadithTypes";
import { 
  fetchHadith, 
  getNextHadith, 
  getPreviousHadith, 
  getTotalHadithCount,
  getHadithIndex,
  getHadithByIndex
} from "@/utils/hadithData";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface HadithReaderProps {
  className?: string;
  initialCollection?: string;
  initialBook?: number;
  initialHadith?: number;
}

export default function HadithReader({
  className,
  initialCollection = "bukhari",
  initialBook = 1,
  initialHadith = 1
}: HadithReaderProps) {
  const [currentCollection, setCurrentCollection] = useState(initialCollection);
  const [currentBook, setCurrentBook] = useState(initialBook);
  const [currentHadith, setCurrentHadith] = useState(initialHadith);
  const [hadithData, setHadithData] = useState<Hadith | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pointsEarned, setPointsEarned] = useState(7600);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalHadiths, setTotalHadiths] = useState(0);
  const [isFirstHadith, setIsFirstHadith] = useState(false);
  const [isLastHadith, setIsLastHadith] = useState(false);
  
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const fromSearch = location.state?.fromSearch || false;
  const searchQuery = location.state?.lastQuery || "";
  const searchResults = location.state?.results || [];
  const scrollPosition = location.state?.scrollPosition || 0;
  
  useEffect(() => {
    const loadTotalCount = async () => {
      try {
        const count = await getTotalHadithCount();
        setTotalHadiths(count);
        console.log(`Total hadiths loaded: ${count}`);
      } catch (error) {
        console.error("Failed to load total hadith count:", error);
      }
    };
    
    loadTotalCount();
  }, []);
  
  useEffect(() => {
    const updateCurrentIndex = async () => {
      if (hadithData) {
        try {
          const index = await getHadithIndex(
            hadithData.collection,
            hadithData.bookNumber,
            hadithData.hadithNumber
          );
          setCurrentIndex(index);
          
          setIsFirstHadith(index === 0);
          setIsLastHadith(index === totalHadiths - 1);
          
          console.log(`Current index: ${index}, isFirst: ${index === 0}, isLast: ${index === totalHadiths - 1}`);
        } catch (error) {
          console.error("Error updating current index:", error);
        }
      }
    };
    
    if (hadithData) {
      updateCurrentIndex();
    }
  }, [hadithData, totalHadiths]);
  
  useEffect(() => {
    const loadHadithData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const hadith = await fetchHadith(currentCollection, currentBook, currentHadith);
        
        setHadithData(hadith);
        setPointsEarned(Math.floor(Math.random() * 5000) + 5000);
      } catch (error) {
        console.error("Failed to load hadith data:", error);
        setError("Failed to load the hadith data. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load the hadith data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHadithData();
  }, [currentCollection, currentBook, currentHadith, toast]);
  
  useEffect(() => {
    console.log(`Props updated: initialCollection=${initialCollection}, initialBook=${initialBook}, initialHadith=${initialHadith}`);
    
    if (initialCollection && initialBook > 0 && initialHadith > 0) {
      setCurrentCollection(initialCollection);
      setCurrentBook(initialBook);
      setCurrentHadith(initialHadith);
    }
  }, [initialCollection, initialBook, initialHadith]);
  
  const goToNextHadith = async () => {
    if (isLoading || !hadithData || isLastHadith) return;
    
    try {
      setIsLoading(true);
      const nextHadith = await getNextHadith(hadithData);
      
      if (nextHadith.bookNumber === hadithData.bookNumber && 
          nextHadith.hadithNumber === hadithData.hadithNumber) {
        setIsLoading(false);
        return;
      }
      
      setCurrentCollection(nextHadith.collection);
      setCurrentBook(nextHadith.bookNumber);
      setCurrentHadith(nextHadith.hadithNumber);
      
      navigate(`/sunnah/reading?collection=${encodeURIComponent(nextHadith.collection)}&book=${nextHadith.bookNumber}&hadith=${nextHadith.hadithNumber}`, { replace: true });
    } catch (error) {
      console.error("Error getting next hadith:", error);
      toast({
        title: "Error",
        description: "Could not load the next hadith.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const goToPrevHadith = async () => {
    if (isLoading || !hadithData || isFirstHadith) return;
    
    try {
      setIsLoading(true);
      const prevHadith = await getPreviousHadith(hadithData);
      
      if (prevHadith.bookNumber === hadithData.bookNumber && 
          prevHadith.hadithNumber === hadithData.hadithNumber) {
        setIsLoading(false);
        return;
      }
      
      setCurrentCollection(prevHadith.collection);
      setCurrentBook(prevHadith.bookNumber);
      setCurrentHadith(prevHadith.hadithNumber);
      
      navigate(`/sunnah/reading?collection=${encodeURIComponent(prevHadith.collection)}&book=${prevHadith.bookNumber}&hadith=${prevHadith.hadithNumber}`, { replace: true });
    } catch (error) {
      console.error("Error getting previous hadith:", error);
      toast({
        title: "Error",
        description: "Could not load the previous hadith.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const goToHadithByIndex = async (index: number) => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const hadith = await getHadithByIndex(index);
      
      if (!hadith) {
        throw new Error("Hadith not found");
      }
      
      setCurrentCollection(hadith.collection);
      setCurrentBook(hadith.bookNumber);
      setCurrentHadith(hadith.hadithNumber);
      setCurrentIndex(index);
      
      navigate(`/sunnah/reading?collection=${encodeURIComponent(hadith.collection)}&book=${hadith.bookNumber}&hadith=${hadith.hadithNumber}`, { replace: true });
    } catch (error) {
      console.error("Error getting hadith by index:", error);
      toast({
        title: "Error",
        description: "Could not load the requested hadith.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDone = () => {
    toast({
      title: "Great job!",
      description: `You've earned ${pointsEarned} points for this hadith.`,
    });
  };
  
  const returnToSearchResults = () => {
    console.log("Returning to search results with:", {
      query: searchQuery,
      resultsCount: searchResults.length,
      scrollPosition
    });
    
    navigate('/sunnah/explore', { 
      state: { 
        preserveSearch: true,
        lastQuery: searchQuery,
        results: searchResults,
        scrollPosition: scrollPosition
      } 
    });
  };
  
  const generatePaginationItems = () => {
    if (totalHadiths <= 1) return null;
    
    const items = [];
    const maxVisiblePages = 3;
    
    let startPage = Math.max(0, currentIndex - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalHadiths - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 0) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink isActive={currentIndex === 0} onClick={() => goToHadithByIndex(0)}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 1) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={currentIndex === i} onClick={() => goToHadithByIndex(i)}>
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    if (endPage < totalHadiths - 1) {
      if (endPage < totalHadiths - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={currentIndex === totalHadiths - 1} 
            onClick={() => goToHadithByIndex(totalHadiths - 1)}
          >
            {totalHadiths}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  if (isLoading && !hadithData) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="h-10 w-10 border-4 border-app-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error && !hadithData) {
    return (
      <div className="w-full flex flex-col justify-center items-center h-64 text-center px-4">
        <div className="text-app-text-secondary mb-4">
          Could not load the requested hadith. The hadith may not exist or there might be an issue with the data source.
        </div>
        <button 
          onClick={() => window.location.href = '/sunnah/reading'}
          className="px-4 py-2 bg-app-green text-app-background-dark rounded-full"
        >
          Go to default hadith
        </button>
      </div>
    );
  }
  
  return (
    <div className={cn("w-full space-y-6 pb-24", className)}>
      {fromSearch && (
        <div className="px-6 pt-2">
          <Button 
            variant="outline" 
            onClick={returnToSearchResults}
            className="glass-card text-white border-white/20 hover:bg-white/10 hover:text-white"
          >
            <Search className="h-4 w-4 mr-2" />
            Return to Results
          </Button>
        </div>
      )}
      
      {hadithData && (
        <HadithCard hadith={hadithData} />
      )}
      
      <div className="w-full flex items-center justify-between px-6">
        <button 
          onClick={goToPrevHadith}
          disabled={isLoading || isFirstHadith}
          className={cn(
            "h-14 w-32 rounded-full flex items-center justify-center glass-card transition-all duration-300",
            !(isLoading || isFirstHadith) ? "hover:bg-white/10 active:scale-95" : "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-6 w-6 text-white mr-2" />
          <span className="text-white font-medium">Previous</span>
        </button>
        
        <button 
          onClick={handleDone}
          className="h-14 w-32 rounded-full flex items-center justify-center bg-app-green text-app-background-dark font-medium hover:bg-app-green-light transition-all duration-300 active:scale-95"
        >
          I'm Done
        </button>
        
        <button 
          onClick={goToNextHadith}
          disabled={isLoading || isLastHadith}
          className={cn(
            "h-14 w-32 rounded-full flex items-center justify-center glass-card transition-all duration-300",
            !(isLoading || isLastHadith) ? "hover:bg-white/10 active:scale-95" : "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="text-white font-medium">Next</span>
          <ChevronRight className="h-6 w-6 text-white ml-2" />
        </button>
      </div>
      
      <div className="px-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={!isFirstHadith ? goToPrevHadith : undefined} 
                className={cn(
                  "glass-card text-white border-white/20",
                  !isFirstHadith ? "hover:bg-white/10 hover:text-white" : "opacity-50 cursor-not-allowed pointer-events-none"
                )}
              />
            </PaginationItem>
            
            {generatePaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={!isLastHadith ? goToNextHadith : undefined} 
                className={cn(
                  "glass-card text-white border-white/20",
                  !isLastHadith ? "hover:bg-white/10 hover:text-white" : "opacity-50 cursor-not-allowed pointer-events-none"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      
      <div className="text-center text-sm text-app-text-secondary">
        <div className="font-medium text-app-green">+{pointsEarned}</div>
        <p>Points earned for this hadith</p>
      </div>
    </div>
  );
}
