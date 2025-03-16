
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import HadithCard from "./HadithCard";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Hadith, sampleHadith } from "@/utils/hadithTypes";
import { fetchHadith, getNextHadith, getPreviousHadith } from "@/utils/hadithData";

interface HadithReaderProps {
  className?: string;
  initialCollection?: string;
  initialBook?: number;
  initialHadith?: number;
}

export default function HadithReader({
  className,
  initialCollection = "Sahih Bukhari",
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
  
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const fromSearch = location.state?.fromSearch || false;
  const searchQuery = location.state?.lastQuery || "";
  const searchResults = location.state?.results || [];
  const scrollPosition = location.state?.scrollPosition || 0;
  
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
    if (isLoading || !hadithData) return;
    
    try {
      const nextHadith = await getNextHadith(hadithData);
      setCurrentCollection(nextHadith.collection);
      setCurrentBook(nextHadith.bookNumber);
      setCurrentHadith(nextHadith.hadithNumber);
    } catch (error) {
      console.error("Error getting next hadith:", error);
      toast({
        title: "Error",
        description: "Could not load the next hadith.",
        variant: "destructive",
      });
    }
  };
  
  const goToPrevHadith = async () => {
    if (isLoading || !hadithData) return;
    
    try {
      const prevHadith = await getPreviousHadith(hadithData);
      setCurrentCollection(prevHadith.collection);
      setCurrentBook(prevHadith.bookNumber);
      setCurrentHadith(prevHadith.hadithNumber);
    } catch (error) {
      console.error("Error getting previous hadith:", error);
      toast({
        title: "Error",
        description: "Could not load the previous hadith.",
        variant: "destructive",
      });
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
          disabled={isLoading}
          className={cn(
            "h-14 w-32 rounded-full flex items-center justify-center glass-card transition-all duration-300",
            !isLoading ? "hover:bg-white/10 active:scale-95" : "opacity-50 cursor-not-allowed"
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
          disabled={isLoading}
          className={cn(
            "h-14 w-32 rounded-full flex items-center justify-center glass-card transition-all duration-300",
            !isLoading ? "hover:bg-white/10 active:scale-95" : "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="text-white font-medium">Next</span>
          <ChevronRight className="h-6 w-6 text-white ml-2" />
        </button>
      </div>
      
      <div className="text-center text-sm text-app-text-secondary">
        <div className="font-medium text-app-green">+{pointsEarned}</div>
        <p>Points earned for this hadith</p>
      </div>
    </div>
  );
}
