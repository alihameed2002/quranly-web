
import { Surah, sampleSurah } from './quranTypes';

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

// Fetch all surahs
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
