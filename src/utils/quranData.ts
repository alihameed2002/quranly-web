export interface Verse {
  id: number;
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
  surahName?: string;
  totalVerses?: number;
}

export interface Surah {
  id: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

// Since we're using the Quran.com API format
interface QuranComVerse {
  id: number;
  verse_key: string;
  text_uthmani: string;
  translations: {
    id: number;
    text: string;
  }[];
}

// Convert Quran.com API format to our app format
const convertQuranComVerse = (verse: QuranComVerse): Verse => {
  const [surahNum, ayahNum] = verse.verse_key.split(':').map(Number);
  return {
    id: verse.id,
    surah: surahNum,
    ayah: ayahNum,
    arabic: verse.text_uthmani,
    translation: verse.translations[0]?.text || "Translation not available"
  };
};

// Sample data for initial state or fallback
export const sampleVerse: Verse = {
  id: 1,
  surah: 7,
  ayah: 128,
  arabic: "قَالَ مُوسَىٰ لِقَوْمِهِ اسْتَعِينُوا بِاللَّهِ وَاصْبِرُوا ۖ إِنَّ الْأَرْضَ لِلَّهِ يُورِثُهَا مَن يَشَاءُ مِنْ عِبَادِهِ ۖ وَالْعاقِبَةُ لِلْمُتَّقِينَ",
  translation: "Moses reassured his people, \"Seek Allah's help and be patient. Indeed, the earth belongs to Allah (alone). He grants it to whoever He chooses of His servants. The ultimate outcome belongs (only) to the righteous.\""
};

export const sampleSurah: Surah = {
  id: 7,
  name: "Al-Araf",
  englishName: "The Heights",
  englishNameTranslation: "The Heights",
  numberOfAyahs: 206,
  revelationType: "Meccan"
};

// Fetch verse from the Quran.com API
export const fetchVerse = async (surahNumber: number, verseNumber: number): Promise<Verse> => {
  try {
    // We're using the alquran.cloud API as a simpler alternative
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${verseNumber}/editions/quran-uthmani,en.sahih`);
    const data = await response.json();
    
    if (data.code === 200 && data.data && Array.isArray(data.data)) {
      return {
        id: verseNumber,
        surah: surahNumber,
        ayah: verseNumber,
        arabic: data.data[0]?.text || "Arabic text not available",
        translation: data.data[1]?.text || "Translation not available"
      };
    }
    
    throw new Error("Failed to fetch verse data");
  } catch (error) {
    console.error("Error fetching verse:", error);
    return sampleVerse; // Fallback to sample data
  }
};

// Fetch surah info
export const fetchSurah = async (surahNumber: number): Promise<Surah> => {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
    const data = await response.json();
    
    if (data.code === 200 && data.data) {
      const surahData = data.data;
      return {
        id: surahData.number,
        name: surahData.name,
        englishName: surahData.englishName,
        englishNameTranslation: surahData.englishNameTranslation,
        numberOfAyahs: surahData.numberOfAyahs,
        revelationType: surahData.revelationType
      };
    }
    
    throw new Error("Failed to fetch surah data");
  } catch (error) {
    console.error("Error fetching surah:", error);
    return sampleSurah; // Fallback to sample data
  }
};

// This function will be used by the QuranReader component
export const fetchQuranData = async (surahNumber: number, verseNumber: number) => {
  try {
    const [surah, verse] = await Promise.all([
      fetchSurah(surahNumber),
      fetchVerse(surahNumber, verseNumber)
    ]);
    
    return { surah, verse };
  } catch (error) {
    console.error("Error fetching Quran data:", error);
    return {
      surah: sampleSurah,
      verse: sampleVerse
    };
  }
};

export const fetchSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await response.json();
    
    if (data.code === 200 && data.data) {
      return data.data.map((surah: any) => ({
        id: surah.number,
        name: surah.name,
        englishName: surah.englishName,
        englishNameTranslation: surah.englishNameTranslation,
        numberOfAyahs: surah.numberOfAyahs,
        revelationType: surah.revelationType
      }));
    }
    
    throw new Error("Failed to fetch surah list");
  } catch (error) {
    console.error("Error fetching surah list:", error);
    return [sampleSurah]; // Fallback to sample data
  }
};

// Improved full Quran data cache with a better data structure
let fullQuranData: Verse[] = [];
let isQuranDataLoading = false;
let quranDataLoadPromise: Promise<Verse[]> | null = null;

// Function to fetch the full Quran text for search with proper caching
export const fetchFullQuranData = async (): Promise<Verse[]> => {
  // If we already have the data cached, return it immediately
  if (fullQuranData.length > 0) {
    return fullQuranData;
  }

  // If a fetch is already in progress, return the existing promise
  if (quranDataLoadPromise) {
    return quranDataLoadPromise;
  }

  // Set loading flag and create a new promise
  isQuranDataLoading = true;
  console.log("Fetching full Quran data for search...");

  // Create and store the promise for potential concurrent requests
  quranDataLoadPromise = new Promise<Verse[]>(async (resolve) => {
    try {
      // In development/testing, use the sample data first
      if (process.env.NODE_ENV === 'development' && extendedSampleVerses.length > 0) {
        console.log("Using extended sample verses for search");
        fullQuranData = extendedSampleVerses;
        return resolve(fullQuranData);
      }
      
      // In a production environment, fetch from the Quran.com API
      const verses: Verse[] = [];
      
      // First get all surahs
      const surahs = await fetchSurahs();
      
      // Then fetch verses for each surah
      for (const surah of surahs) {
        try {
          // We're using the alquran.cloud API
          const response = await fetch(`https://api.alquran.cloud/v1/surah/${surah.id}/en.sahih`);
          const data = await response.json();
          
          if (data.code === 200 && data.data && data.data.ayahs) {
            // Map API response to our Verse format
            const surahVerses = data.data.ayahs.map((ayah: any, index: number) => ({
              id: (surah.id * 1000) + (index + 1), // Generate a unique ID
              surah: surah.id,
              ayah: index + 1,
              arabic: "", // We'll fetch the Arabic text separately if needed
              translation: ayah.text,
              surahName: surah.englishName,
              totalVerses: surah.numberOfAyahs
            }));
            
            verses.push(...surahVerses);
            console.log(`Fetched ${surahVerses.length} verses from Surah ${surah.englishName}`);
          }
        } catch (error) {
          console.error(`Error fetching verses for Surah ${surah.id}:`, error);
        }
      }
      
      if (verses.length > 0) {
        fullQuranData = verses;
        console.log(`Loaded ${verses.length} verses for search`);
      } else {
        // Fallback to sample data if API fails
        console.warn("API fetch failed, using sample data instead");
        fullQuranData = extendedSampleVerses;
      }
      
      resolve(fullQuranData);
    } catch (error) {
      console.error("Error fetching full Quran data:", error);
      // Fallback to sample data
      fullQuranData = extendedSampleVerses;
      resolve(fullQuranData);
    } finally {
      isQuranDataLoading = false;
      quranDataLoadPromise = null;
    }
  });
  
  return quranDataLoadPromise;
};

// Improved search function with better error handling
export const fetchSearchResults = async (query: string, maxResults = 100): Promise<Verse[]> => {
  if (!query.trim()) return [];
  
  try {
    // Get the full Quran data for search
    console.log(`Searching for: "${query}"`);
    const fullData = await fetchFullQuranData();
    
    if (fullData.length === 0) {
      console.error("No Quran data available for search");
      return [];
    }
    
    console.log(`Searching through ${fullData.length} verses`);
    
    // Use the improved search algorithm from searchUtils
    const { searchVerses, prepareVersesForSearch } = await import('./searchUtils');
    
    // Ensure all verses have valid translations for search
    const preparedVerses = prepareVersesForSearch(fullData);
    
    // Perform the search
    const results = searchVerses(preparedVerses, query);
    
    console.log(`Search complete. Found ${results.length} matches`);
    
    // Limit the number of results to avoid performance issues
    return results.slice(0, maxResults);
  } catch (error) {
    console.error("Error performing search:", error);
    return [];
  }
};

// Expanded sample verses for search functionality
export const extendedSampleVerses: Verse[] = [
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
    arabic: sampleVerse.arabic,
    translation: sampleVerse.translation,
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
  },
  {
    id: 8,
    surah: 4,
    ayah: 36,
    arabic: "۞ وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا ۖ وَبِالْوَالِدَيْنِ إِحْسَانًا وَبِذِي الْقُرْبَىٰ وَالْيَتَامَىٰ وَالْمَسَاكِينِ وَالْجَارِ ذِي الْقُرْبَىٰ وَالْجَارِ الْجُنُبِ وَالصَّاحِبِ بِالْجَنبِ وَابْنِ السَّبِيلِ وَمَا مَلَكَتْ أَيْمَانُكُمْ ۗ إِنَّ اللَّهَ لَا يُحِبُّ مَن كَانَ مُخْتَالًا فَخُورًا",
    translation: "Worship Allah and associate nothing with Him, and to parents do good, and to relatives, orphans, the needy, the near neighbor, the neighbor farther away, the companion at your side, the traveler, and those whom your right hands possess. Indeed, Allah does not like those who are self-deluding and boastful.",
    surahName: "An-Nisa",
    totalVerses: 176
  },
  {
    id: 9,
    surah: 49,
    ayah: 13,
    arabic: "يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا ۚ إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ ۚ إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ",
    translation: "O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another. Indeed, the most noble of you in the sight of Allah is the most righteous of you. Indeed, Allah is Knowing and Acquainted.",
    surahName: "Al-Hujurat",
    totalVerses: 18
  },
  {
    id: 10,
    surah: 55,
    ayah: 1,
    arabic: "الرَّحْمَٰنُ",
    translation: "The Most Merciful",
    surahName: "Ar-Rahman",
    totalVerses: 78
  },
  {
    id: 11,
    surah: 55,
    ayah: 2,
    arabic: "عَلَّمَ الْقُرْآنَ",
    translation: "Taught the Qur'an",
    surahName: "Ar-Rahman",
    totalVerses: 78
  },
  {
    id: 12,
    surah: 55,
    ayah: 3,
    arabic: "خَلَقَ الْإِنسَانَ",
    translation: "Created man",
    surahName: "Ar-Rahman",
    totalVerses: 78
  },
  {
    id: 13,
    surah: 55,
    ayah: 4,
    arabic: "عَلَّمَهُ الْبَيَانَ",
    translation: "And taught him eloquence",
    surahName: "Ar-Rahman",
    totalVerses: 78
  },
  {
    id: 14,
    surah: 103,
    ayah: 1,
    arabic: "وَالْعَصْرِ",
    translation: "By time",
    surahName: "Al-Asr",
    totalVerses: 3
  },
  {
    id: 15,
    surah: 103,
    ayah: 2,
    arabic: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    translation: "Indeed, mankind is in loss",
    surahName: "Al-Asr",
    totalVerses: 3
  },
  {
    id: 16,
    surah: 103,
    ayah: 3,
    arabic: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
    translation: "Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience",
    surahName: "Al-Asr",
    totalVerses: 3
  }
];

// Updated search functionality using the searchUtils
import { searchVerses } from './searchUtils';

// Search functionality
export const fetchSearchResults = async (query: string): Promise<Verse[]> => {
  if (!query.trim()) return [];
  
  try {
    // Get the full Quran data for search
    const fullData = await fetchFullQuranData();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Use our improved search function
    return searchVerses(fullData, query);
  } catch (error) {
    console.error("Error performing search:", error);
    return [];
  }
};
