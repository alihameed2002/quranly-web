
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
  arabic: "قَالَ مُوسَىٰ لِقَوْمِهِ اسْتَعِينُوا بِاللَّهِ وَاصْبِرُوا ۖ إِنَّ الْأَرْضَ لِلَّهِ يُورِثُهَا مَن يَشَاءُ مِنْ عِبَادِهِ ۖ وَالْعَاقِبَةُ لِلْمُتَّقِينَ",
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

// Search functionality
export const fetchSearchResults = async (query: string): Promise<Verse[]> => {
  if (!query.trim()) return [];
  
  try {
    // In a real app, we would connect to a proper search API
    // For now, we'll simulate search results with a few hard-coded verses
    const searchResults: Verse[] = [];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Implementing a simple search with the sample verses we have
    const surahs = await fetchSurahs();
    
    // For demo purposes, add a few sample verses that we'll "search through"
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
      }
    ];
    
    // Simple search function
    const lowerQuery = query.toLowerCase();
    
    // Filter verses that match the query
    const filteredVerses = sampleVerses.filter(verse => 
      verse.translation.toLowerCase().includes(lowerQuery) || 
      verse.surahName.toLowerCase().includes(lowerQuery)
    );
    
    return filteredVerses;
  } catch (error) {
    console.error("Error performing search:", error);
    return [];
  }
};
