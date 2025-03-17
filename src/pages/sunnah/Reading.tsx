
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HadithReader from "@/components/HadithReader";
import Navigation from "@/components/Navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { BookText } from "lucide-react";
import { fetchHadith, getHadithByIndex } from "@/utils/hadithData";

const SunnahReading = () => {
  const [loading, setLoading] = useState(true);
  const [currentCollection, setCurrentCollection] = useState("Sahih Bukhari");
  const [currentBook, setCurrentBook] = useState(1);
  const [currentHadith, setCurrentHadith] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  
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
            setCurrentCollection(hadith.collection);
            setCurrentBook(hadith.bookNumber);
            setCurrentHadith(hadith.hadithNumber);
            setLoading(false);
            return;
          }
        }
        
        // Only allow Sahih Bukhari collection for now
        if (collectionParam && collectionParam === "Sahih Bukhari") {
          setCurrentCollection(collectionParam);
        } else {
          setCurrentCollection("Sahih Bukhari");
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
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading hadith data:", error);
        setLoading(false);
      }
    };
    
    loadData();
  }, [location.search]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-app-background flex items-center justify-center">
        <div className="glass-card rounded-lg p-8 flex flex-col items-center justify-center animate-pulse-gentle">
          <div className="h-10 w-10 border-4 border-app-green border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-app-text-secondary">Loading hadith...</p>
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
            <BookText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Reading Sunnah</h1>
            <p className="text-app-text-secondary">Authentic hadith collections</p>
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
