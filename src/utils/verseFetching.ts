
import { Verse, QuranComVerse, sampleVerse } from './quranTypes';

// Convert Quran.com API format to our app format
export const convertQuranComVerse = (verse: QuranComVerse): Verse => {
  const [surahNum, ayahNum] = verse.verse_key.split(':').map(Number);
  return {
    id: verse.id,
    surah: surahNum,
    ayah: ayahNum,
    arabic: verse.text_uthmani,
    translation: verse.translations[0]?.text || "Translation not available"
  };
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

// Function to fetch the full Quran text for search using static JSON
export const fetchStaticQuranData = async (): Promise<Verse[]> => {
  try {
    // Using a publicly available Quran translations API
    const response = await fetch('https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json');
    const data = await response.json();
    
    const verses: Verse[] = [];
    
    // Process the data into our format
    data.forEach((surah: any) => {
      const surahNumber = surah.number;
      const surahName = surah.englishName || surah.name;
      const totalVerses = surah.numberOfAyahs || surah.verses.length;
      
      surah.verses.forEach((verse: any, index: number) => {
        verses.push({
          id: (surahNumber * 1000) + (index + 1),
          surah: surahNumber,
          ayah: index + 1,
          arabic: verse.arabic || "",
          translation: verse.translation || verse.text || "",
          surahName: surahName,
          totalVerses: totalVerses
        });
      });
    });
    
    console.log(`Loaded ${verses.length} verses from static JSON`);
    return verses;
  } catch (error) {
    console.error("Error loading static Quran data:", error);
    throw error;
  }
};
