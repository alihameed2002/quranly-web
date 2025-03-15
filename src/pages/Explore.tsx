
import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import VerseCard from "@/components/VerseCard";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: number;
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
  surahName: string;
  totalVerses: number;
}

const Explore = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Sample verses for demonstration (in a real app, this would come from an API)
  const sampleVerses = [
    {
      id: 1,
      surah: 2,
      ayah: 155,
      arabic: "وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ",
      translation: "And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient",
      surahName: "Al-Baqarah",
      totalVerses: 286
    },
    {
      id: 2,
      surah: 3,
      ayah: 159,
      arabic: "فَبِمَا رَحْمَةٍ مِّنَ اللَّهِ لِنتَ لَهُمْ ۖ وَلَوْ كُنتَ فَظًّا غَلِيظَ الْقَلْبِ لَانفَضُّوا مِنْ حَوْلِكَ ۖ فَاعْفُ عَنْهُمْ وَاسْتَغْفِرْ لَهُمْ وَشَاوِرْهُمْ فِي الْأَمْرِ ۖ فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ ۚ إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ",
      translation: "So by mercy from Allah, [O Muhammad], you were lenient with them. And if you had been rude [in speech] and harsh in heart, they would have disbanded from about you. So pardon them and ask forgiveness for them and consult them in the matter. And when you have decided, then rely upon Allah. Indeed, Allah loves those who rely [upon Him].",
      surahName: "Ali 'Imran",
      totalVerses: 200
    },
    {
      id: 3,
      surah: 7,
      ayah: 128,
      arabic: "قَالَ مُوسَىٰ لِقَوْمِهِ اسْتَعِينُوا بِاللَّهِ وَاصْبِرُوا ۖ إِنَّ الْأَرْضَ لِلَّهِ يُورِثُهَا مَن يَشَاءُ مِنْ عِبَادِهِ ۖ وَالْعَاقِبَةُ لِلْمُتَّقِينَ",
      translation: "Moses reassured his people, \"Seek Allah's help and be patient. Indeed, the earth belongs to Allah (alone). He grants it to whoever He chooses of His servants. The ultimate outcome belongs (only) to the righteous.\"",
      surahName: "Al-Araf",
      totalVerses: 206
    },
    {
      id: 4,
      surah: 94,
      ayah: 5,
      arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
      translation: "For indeed, with hardship [will be] ease.",
      surahName: "Ash-Sharh",
      totalVerses: 8
    },
    {
      id: 5,
      surah: 94,
      ayah: 6,
      arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      translation: "Indeed, with hardship [will be] ease.",
      surahName: "Ash-Sharh",
      totalVerses: 8
    },
    {
      id: 6,
      surah: 21,
      ayah: 87,
      arabic: "وَذَا النُّونِ إِذ ذَّهَبَ مُغَاضِبًا فَظَنَّ أَن لَّن نَّقْدِرَ عَلَيْهِ فَنَادَىٰ فِي الظُّلُمَاتِ أَن لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
      translation: "And [mention] the man of the fish, when he went off in anger and thought that We would not decree [anything] upon him. And he called out within the darknesses, 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.'",
      surahName: "Al-Anbya",
      totalVerses: 112
    },
    {
      id: 7,
      surah: 2,
      ayah: 286,
      arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
      translation: "Allah does not burden a soul beyond that it can bear",
      surahName: "Al-Baqarah",
      totalVerses: 286
    }
  ];
  
  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Search query is empty",
        description: "Please enter a keyword to search for",
      });
      return;
    }
    
    setIsSearching(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Perform search on the sample verses
      const lowerQuery = query.toLowerCase();
      const searchResults = sampleVerses.filter(verse => 
        verse.translation.toLowerCase().includes(lowerQuery) || 
        verse.surahName.toLowerCase().includes(lowerQuery)
      );
      
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        toast({
          title: "No results found",
          description: `No verses found for "${query}"`,
        });
      } else {
        toast({
          title: "Search completed",
          description: `Found ${searchResults.length} results for "${query}"`,
        });
      }
    } catch (error) {
      console.error("Search failed:", error);
      toast({
        title: "Search failed",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-app-background pb-20">
      <Header showBack={false} />
      
      <main className="max-w-screen-md mx-auto space-y-8 py-4">
        <div className="px-6 flex items-center space-x-3">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
            <Search className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Explore Quran</h1>
            <p className="text-app-text-secondary">Search for verses by keyword</p>
          </div>
        </div>
        
        <div className="px-6">
          <div className="glass-card rounded-xl p-4 space-y-4">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the Quran..."
                className="w-full h-12 bg-white/5 border border-white/10 rounded-lg px-4 pr-12 text-white"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                disabled={isSearching}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center bg-app-green text-app-background-dark hover:bg-app-green-light transition-all duration-300"
              >
                {isSearching ? (
                  <div className="h-4 w-4 border-2 border-app-background-dark border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {results.length > 0 && (
          <div className="px-6">
            <h2 className="text-xl font-semibold text-white mb-4">Search Results</h2>
            <div className="space-y-6">
              {results.map((result) => (
                <div 
                  key={result.id} 
                  className="glass-card rounded-xl p-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => navigate(`/reading?surah=${result.surah}&verse=${result.ayah}`)}
                >
                  <VerseCard
                    surahName={result.surahName}
                    surahNumber={result.surah}
                    verseNumber={result.ayah}
                    totalVerses={result.totalVerses}
                    arabicText={result.arabic}
                    translation={result.translation}
                    minimized={true}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Navigation />
    </div>
  );
};

export default Explore;
