
// Export all Quran data functions and types from their respective files
// This file serves as the main export point for backward compatibility

export * from './quranTypes';
export * from './verseFetching';
export * from './surahFetching';
export * from './quranDataCache';
export * from './searchFunctions';

// Main function that combines fetching of verse and surah data
export const fetchQuranData = async (surahNumber: number, verseNumber: number) => {
  try {
    const { fetchSurah } = await import('./surahFetching');
    const { fetchVerse } = await import('./verseFetching');
    
    const [surah, verse] = await Promise.all([
      fetchSurah(surahNumber),
      fetchVerse(surahNumber, verseNumber)
    ]);
    
    return { surah, verse };
  } catch (error) {
    console.error("Error fetching Quran data:", error);
    
    // Import sample data for fallback
    const { sampleSurah, sampleVerse } = await import('./quranTypes');
    
    return {
      surah: sampleSurah,
      verse: sampleVerse
    };
  }
};
