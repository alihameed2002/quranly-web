
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HadithReader from "@/components/HadithReader";
import Navigation from "@/components/Navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, RefreshCw, AlertTriangle } from "lucide-react";
import { fetchHadith, getHadithByIndex, getAllHadiths, loadHadithData } from "@/utils/hadithData";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SunnahReading = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCollection, setCurrentCollection] = useState("bukhari");
  const [currentBook, setCurrentBook] = useState(1);
  const [currentHadith, setCurrentHadith] = useState(1);
  const [noData, setNoData] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Preload hadiths to ensure navigation works
  useEffect(() => {
    const preloadHadiths = async () => {
      try {
        console.log("Preloading hadiths...");
        setLoading(true);
        await loadHadithData(currentCollection);
        const allHadiths = await getAllHadiths();
        
        if (allHadiths.length === 0) {
          console.log("No hadiths found, using fallback data");
          setNoData(true);
        } else {
          setNoData(false);
        }
        
        console.log("Hadiths preloaded successfully");
      } catch (error) {
        console.error("Failed to preload hadiths:", error);
        setError("Failed to load hadith data. Please try refreshing.");
        toast({
          title: "Notice",
          description: "Using sample data as API is currently unavailable",
          variant: "default",
        });
      } finally {
        setLoading(false);
      }
    };
    
    preloadHadiths();
  }, [currentCollection, toast]);
  
  useEffect(() => {
    // Parse collection, book and hadith from URL query parameters
    const params = new URLSearchParams(location.search);
    const collectionParam = params.get('collection');
    const bookParam = params.get('book');
    const hadithParam = params.get('hadith');
    const indexParam = params.get('index');
    
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Handle direct index navigation
        if (indexParam) {
          const index = parseInt(indexParam);
          if (!isNaN(index) && index >= 0) {
            const hadith = await getHadithByIndex(index);
            console.log(`Loaded hadith by index ${index}:`, hadith);
            setCurrentCollection(hadith.collection);
            setCurrentBook(hadith.bookNumber);
            setCurrentHadith(hadith.hadithNumber);
            setLoading(false);
            return;
          }
        }
        
        // Handle collection parameter
        if (collectionParam) {
          setCurrentCollection(collectionParam);
        } else {
          setCurrentCollection("bukhari"); // Default to Bukhari
        }
        
        if (bookParam) {
          const bookNum = Number(bookParam);
          if (!isNaN(bookNum) && bookNum >= 1) {
            setCurrentBook(bookNum);
          }
        }
        
        if (hadithParam) {
          const hadithNum = Number(hadithParam);
          if (!isNaN(hadithNum) && hadithNum >= 1) {
            setCurrentHadith(hadithNum);
          }
        } else {
          // If no hadith is specified, default to hadith 1
          setCurrentHadith(1);
        }
        
        // If we have no parameters at all, update the URL with the defaults
        if (!collectionParam && !bookParam && !hadithParam && !indexParam) {
          navigate(`/sunnah/reading?collection=bukhari&book=1&hadith=1`, { replace: true });
        }
        
        // Ensure data is loaded for the selected collection
        await loadHadithData(collectionParam || "bukhari");
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading hadith data:", error);
        setError("Failed to load hadith data. Displaying sample content instead.");
        setLoading(false);
      }
    };
    
    loadData();
  }, [location.search, navigate]);
  
  const handleRetry = async () => {
    setError(null);
    setLoading(true);
    
    try {
      await loadHadithData(currentCollection, true); // Force refresh
      setLoading(false);
      toast({
        title: "Success",
        description: "Hadith data loaded successfully",
      });
    } catch (error) {
      console.error("Failed to load hadith data on retry:", error);
      setError("Using sample hadith data as the API is currently unavailable.");
      setNoData(true);
      setLoading(false);
      toast({
        title: "Notice",
        description: "Using sample data as API is currently unavailable",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-app-background flex items-center justify-center">
        <div className="glass-card rounded-lg p-8 flex flex-col items-center justify-center animate-pulse-gentle">
          <div className="h-10 w-10 border-4 border-app-green border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-app-text-secondary">Loading hadith collection...</p>
        </div>
      </div>
    );
  }
  
  if (error && noData) {
    return (
      <div className="min-h-screen bg-app-background flex items-center justify-center">
        <div className="glass-card rounded-lg p-8 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="h-12 w-12 text-amber-400 mb-4" />
          <div className="mb-4 text-white text-lg">API Unavailable</div>
          <p className="text-app-text-secondary mb-4">{error}</p>
          <div className="flex gap-4">
            <Button 
              onClick={handleRetry}
              className="bg-app-green hover:bg-app-green-light text-app-background-dark"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> 
              Retry Connection
            </Button>
            
            <Button 
              onClick={() => navigate('/sunnah/reading?collection=bukhari&book=1&hadith=1', { replace: true })}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Continue with Sample Data
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-app-background pb-20">
      <Header showBack={false} />
      
      <main className="max-w-screen-md mx-auto space-y-8 py-4">
        <div className="px-6 flex items-center space-x-3">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Reading Sunnah</h1>
            <p className="text-app-text-secondary">
              {noData ? "Sample hadith data (API unavailable)" : "Authentic hadith collections"}
              {noData && (
                <Button 
                  onClick={handleRetry} 
                  variant="link" 
                  className="text-app-green p-0 h-auto ml-2"
                >
                  Retry
                </Button>
              )}
            </p>
          </div>
        </div>
        
        <HadithReader
          initialCollection={currentCollection}
          initialBook={currentBook}
          initialHadith={currentHadith}
        />
      </main>
      
      <Navigation />
    </div>
  );
};

export default SunnahReading;
