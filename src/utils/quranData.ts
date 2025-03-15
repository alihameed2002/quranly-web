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
    console.log("Searching for:", query);
    
    // Load all surahs for metadata
    const surahs = await fetchSurahs();
    
    // Instead of using sample verses, let's search through the actual Quran content
    // We'll use the Quran.com API's search endpoint
    const response = await fetch(`https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}&size=20&page=0&language=en`);
    const data = await response.json();
    
    if (!response.ok || !data.search || !data.search.results) {
      console.error("Error with Quran.com search API:", data);
      throw new Error("Failed to search the Quran");
    }
    
    // Transform the search results into our app's format
    const results = data.search.results.map((result: any) => {
      const verseKey = result.verse_key;
      const [surahNum, ayahNum] = verseKey.split(':').map(Number);
      const surahInfo = surahs.find(s => s.id === surahNum);
      
      return {
        id: result.verse_id || 0,
        surah: surahNum,
        ayah: ayahNum,
        arabic: result.text_madani || "Arabic text not available",
        translation: result.text || "Translation not available",
        surahName: surahInfo?.englishName || `Surah ${surahNum}`,
        totalVerses: surahInfo?.numberOfAyahs || 0
      };
    });
    
    console.log(`Found ${results.length} verses matching "${query}"`);
    return results;
  } catch (error) {
    console.error("Error performing search:", error);
    
    // Fallback to our extended sample verses if the API search fails
    const sampleVerses = [
      {
        id: 14,
        surah: 55,
        ayah: 1,
        arabic: "الرَّحْمَٰنُ",
        translation: "The Most Merciful",
      },
      {
        id: 15,
        surah: 112,
        ayah: 1,
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        translation: "Say, 'He is Allah, [who is] One'",
      },
      {
        id: 16,
        surah: 24,
        ayah: 35,
        arabic: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
        translation: "Allah is the Light of the heavens and the earth",
      },
      {
        id: 17,
        surah: 2,
        ayah: 185,
        arabic: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ",
        translation: "The month of Ramadan [is that] in which was revealed the Qur'an",
      }
    ];
    
    // Add surah name and total verses to each verse
    const enrichedVerses = sampleVerses.map(verse => {
      const surahInfo = surahs.find(s => s.id === verse.surah);
      return {
        ...verse,
        surahName: surahInfo?.englishName || `Surah ${verse.surah}`,
        totalVerses: surahInfo?.numberOfAyahs || 0
      };
    });
    
    // Filter verses that match the query in translation or surahName
    const lowerQuery = query.toLowerCase();
    const filteredVerses = enrichedVerses.filter(verse => 
      verse.translation.toLowerCase().includes(lowerQuery) || 
      verse.surahName.toLowerCase().includes(lowerQuery)
    );
    
    console.log(`Fallback: Found ${filteredVerses.length} verses matching "${query}"`);
    return filteredVerses;
  }
};
