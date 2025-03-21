import { Verse, extendedSampleVerses } from './quranTypes';
import { getVerse as getVerseFromDB, getVersesBySurah, saveVerses } from './indexedDB';

/**
 * Clean up verse translation text by removing unwanted HTML tags and footnotes
 * This function removes HTML tags like <sup> and footnote references
 */
function cleanVerseTranslation(text: string): string {
  if (!text) return '';
  
  // Remove <sup> tags and their content (footnotes)
  let cleaned = text.replace(/<sup[^>]*>.*?<\/sup>/g, '');
  
  // Remove footnote references in various formats
  cleaned = cleaned.replace(/<sup foot_note=\d+>\d+<\/sup>/g, '');
  cleaned = cleaned.replace(/\[\d+\]/g, ''); // Remove [1], [2], etc.
  cleaned = cleaned.replace(/\(\d+\)/g, ''); // Remove (1), (2), etc.
  
  // Remove other HTML tags that might be present
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Clean up extra spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

// Convert a verse from Quran.com API format to our format
export function convertQuranComVerse(verse: any, surahNumber: number): Verse {
  const translation = verse.translations?.length > 0 ? verse.translations[0].text : '';
  
  return {
    id: (surahNumber * 1000) + verse.numberInSurah,
    surah: surahNumber,
    ayah: verse.numberInSurah,
    arabic: verse.text,
    translation: cleanVerseTranslation(translation),
    surahName: '', // Will be filled in later
    totalVerses: 0 // Will be filled in later
  };
}

// Fetch a specific verse
export async function fetchVerse(
  surahNumber: number,
  ayahNumber: number
): Promise<Verse | null> {
  console.log(`Fetching verse: Surah ${surahNumber}, Ayah ${ayahNumber}`);
  
  try {
    // First try to get from IndexedDB
    const verseFromDB = await getVerseFromDB(surahNumber, ayahNumber);
    if (verseFromDB) {
      console.log(`Using cached verse data from IndexedDB: Surah ${surahNumber}, Ayah ${ayahNumber}`);
      return verseFromDB;
    }
    
    // If not in IndexedDB, fetch from network
    console.log(`Verse not in cache, fetching from API: Surah ${surahNumber}, Ayah ${ayahNumber}`);
    
    // Fetch verse text from the Quran.com API
    const response = await fetch(
      `https://api.quran.com/api/v4/verses/by_key/${surahNumber}:${ayahNumber}?language=en&words=false&translations=131&fields=text_uthmani&reciter=7`
    );
    const data = await response.json();

    if (data?.verse) {
      const verse: Verse = {
        id: (surahNumber * 1000) + ayahNumber,
        surah: surahNumber,
        ayah: ayahNumber,
        arabic: data.verse.text_uthmani,
        translation: cleanVerseTranslation(data.verse.translations?.[0]?.text || ''),
        surahName: '', // Will be filled in from separate API call
        totalVerses: 0, // Will be filled in from separate API call
      };

      // Fetch surah metadata to get surah name and total verse count
      try {
        const surahResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
        const surahData = await surahResponse.json();
        if (surahData.code === 200 && surahData.data) {
          verse.surahName = surahData.data.englishName;
          verse.totalVerses = surahData.data.numberOfAyahs;
        }
      } catch (surahError) {
        console.error(`Error fetching surah metadata for ${surahNumber}:`, surahError);
        // Default values will be used
      }

      // Save to IndexedDB for offline use
      await saveVerses([verse]);
      
      return verse;
    }
    throw new Error(`Failed to fetch verse ${surahNumber}:${ayahNumber}`);
  } catch (error) {
    console.error(`Error fetching verse ${surahNumber}:${ayahNumber}:`, error);
    
    // Try to return a sample verse that matches
    const sampleVerse = extendedSampleVerses.find(
      v => v.surah === surahNumber && v.ayah === ayahNumber
    );
    
    if (sampleVerse) {
      return sampleVerse;
    }
    
    // If no matching sample verse, create a placeholder
    return {
      id: (surahNumber * 1000) + ayahNumber,
      surah: surahNumber,
      ayah: ayahNumber,
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'Unable to load verse. Please check your connection.',
      surahName: `Surah ${surahNumber}`,
      totalVerses: 0,
    };
  }
}

// Load all verses for a surah
export async function fetchSurahVerses(surahNumber: number): Promise<Verse[]> {
  console.log(`Fetching verses for Surah ${surahNumber}`);
  
  try {
    // First try to get from IndexedDB
    const versesFromDB = await getVersesBySurah(surahNumber);
    if (versesFromDB && versesFromDB.length > 0) {
      console.log(`Using cached verses from IndexedDB for Surah ${surahNumber} (${versesFromDB.length} verses)`);
      return versesFromDB;
    }
    
    // If not in IndexedDB, fetch from network
    console.log(`Verses not in cache, fetching from API: Surah ${surahNumber}`);
    
    // Get surah metadata first to know how many verses
    const surahResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
    const surahData = await surahResponse.json();
    
    if (surahData.code !== 200 || !surahData.data) {
      throw new Error(`Failed to fetch surah metadata for ${surahNumber}`);
    }
    
    const surahName = surahData.data.englishName;
    const totalVerses = surahData.data.numberOfAyahs;
    
    // Now fetch all verses for this surah
    const response = await fetch(
      `https://api.quran.com/api/v4/verses/by_chapter/${surahNumber}?language=en&words=false&translations=131&fields=text_uthmani&reciter=7`
    );
    const data = await response.json();
    
    if (data && data.verses) {
      const verses: Verse[] = data.verses.map((v: any) => ({
        id: (surahNumber * 1000) + v.verse_number,
        surah: surahNumber,
        ayah: v.verse_number,
        arabic: v.text_uthmani,
        translation: cleanVerseTranslation(v.translations?.[0]?.text || ''),
        surahName,
        totalVerses
      }));
      
      // Save to IndexedDB for offline use
      await saveVerses(verses);
      
      return verses;
    }
    throw new Error(`Failed to fetch verses for surah ${surahNumber}`);
  } catch (error) {
    console.error(`Error fetching verses for Surah ${surahNumber}:`, error);
    
    // If we have any sample verses for this surah, return them
    const sampleVerses = extendedSampleVerses.filter(v => v.surah === surahNumber);
    if (sampleVerses.length > 0) {
      return sampleVerses;
    }
    
    // Return a single placeholder verse
    return [{
      id: surahNumber * 1000 + 1,
      surah: surahNumber,
      ayah: 1,
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'Unable to load verses. Please check your connection.',
      surahName: `Surah ${surahNumber}`,
      totalVerses: 0
    }];
  }
}

// Fetch all static Quran data from local JSON
export async function fetchStaticQuranData(): Promise<Verse[]> {
  try {
    // First try to get from IndexedDB (all verses)
    const versesFromDB = await getVersesBySurah(1); // Check if we have at least one surah
    if (versesFromDB && versesFromDB.length > 0) {
      console.log('Verses found in IndexedDB, attempting to load full Quran');
      
      // Try loading one surah at a time to avoid memory issues
      const allVerses: Verse[] = [];
      for (let surahNumber = 1; surahNumber <= 114; surahNumber++) {
        const surahVerses = await getVersesBySurah(surahNumber);
        if (surahVerses && surahVerses.length > 0) {
          allVerses.push(...surahVerses);
        }
      }
      
      if (allVerses.length > 0) {
        console.log(`Loaded ${allVerses.length} verses from IndexedDB`);
        return allVerses;
      }
    }
    
    // If not in IndexedDB, fetch from local JSON
    console.log('Fetching Quran data from static JSON file');
    const response = await fetch('/data/quran.json');
    if (!response.ok) {
      throw new Error(`Failed to load static Quran data: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data || !Array.isArray(data.verses)) {
      throw new Error('Invalid Quran data format');
    }
    
    const verses: Verse[] = data.verses.map((v: any) => ({
      id: (v.surah * 1000) + v.ayah,
      surah: v.surah,
      ayah: v.ayah,
      arabic: v.arabic,
      translation: v.translation,
      surahName: v.surahName || `Surah ${v.surah}`,
      totalVerses: v.totalVerses || 0
    }));
    
    // Save to IndexedDB for offline use (in chunks to avoid memory issues)
    const CHUNK_SIZE = 500;
    for (let i = 0; i < verses.length; i += CHUNK_SIZE) {
      const chunk = verses.slice(i, i + CHUNK_SIZE);
      await saveVerses(chunk);
      console.log(`Saved verses ${i + 1}-${i + chunk.length} to IndexedDB`);
    }
    
    return verses;
  } catch (error) {
    console.error('Error loading static Quran data:', error);
    
    // Return sample data if all else fails
    console.warn('Using sample Quran data instead');
    return extendedSampleVerses;
  }
}
