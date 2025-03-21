import { Surah } from './quranTypes';
import { getAllSurahs, saveSurahData } from './indexedDB';

// Fetch data for a specific surah
export async function fetchSurah(id: number): Promise<Surah | undefined> {
  try {
    // First try to get all surahs from IndexedDB
    const offlineSurahs = await getAllSurahs();
    
    // If we have offline data, find the requested surah
    if (offlineSurahs && offlineSurahs.length > 0) {
      const surah = offlineSurahs.find(s => s.id === id);
      if (surah) {
        console.log(`Using cached surah data for Surah ${id} from IndexedDB`);
        return surah;
      }
    }
    
    // If not in IndexedDB, fetch from network
    console.log(`Fetching surah ${id} from API`);
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
    const json = await response.json();

    if (json.code === 200 && json.data) {
      const surah: Surah = {
        id: json.data.number,
        name: json.data.name,
        englishName: json.data.englishName,
        englishNameTranslation: json.data.englishNameTranslation,
        numberOfAyahs: json.data.numberOfAyahs,
        revelationType: json.data.revelationType
      };
      
      // Save this surah to IndexedDB
      await saveSurahData([surah]);
      
      return surah;
    }
    throw new Error(`Failed to fetch surah ${id}`);
  } catch (error) {
    console.error(`Error fetching surah ${id}:`, error);
    // Return fallback data for the surah if we can't fetch it
    return getFallbackSurah(id);
  }
}

// Fetch list of all surahs
export async function fetchSurahs(): Promise<Surah[]> {
  try {
    // First try to get all surahs from IndexedDB
    const offlineSurahs = await getAllSurahs();
    
    // If we have complete offline data (all 114 surahs), use it
    if (offlineSurahs && offlineSurahs.length === 114) {
      console.log('Using cached surah list from IndexedDB');
      return offlineSurahs;
    }
    
    // If not in IndexedDB or incomplete, fetch from network
    console.log('Fetching surah list from API');
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const json = await response.json();

    if (json.code === 200 && json.data) {
      const surahs: Surah[] = json.data.map((item: any) => ({
        id: item.number,
        name: item.name,
        englishName: item.englishName,
        englishNameTranslation: item.englishNameTranslation,
        numberOfAyahs: item.numberOfAyahs,
        revelationType: item.revelationType
      }));
      
      // Save all surahs to IndexedDB
      await saveSurahData(surahs);
      
      return surahs;
    }
    throw new Error('Failed to fetch list of surahs');
  } catch (error) {
    console.error('Error fetching surahs:', error);
    // Return fallback data if we can't fetch the list
    return getFallbackSurahs();
  }
}

// Fallback data for a single surah if network request fails
function getFallbackSurah(id: number): Surah {
  // Common surahs as fallback examples
  const commonSurahs: Record<number, Surah> = {
    1: {
      id: 1,
      name: 'الفاتحة',
      englishName: 'Al-Fatiha',
      englishNameTranslation: 'The Opening',
      numberOfAyahs: 7,
      revelationType: 'Meccan'
    },
    2: {
      id: 2,
      name: 'البقرة',
      englishName: 'Al-Baqarah',
      englishNameTranslation: 'The Cow',
      numberOfAyahs: 286,
      revelationType: 'Medinan'
    },
    3: {
      id: 3,
      name: 'آل عمران',
      englishName: 'Aal-Imran',
      englishNameTranslation: 'The Family of Imran',
      numberOfAyahs: 200,
      revelationType: 'Medinan'
    },
    36: {
      id: 36,
      name: 'يس',
      englishName: 'Ya-Seen',
      englishNameTranslation: 'Ya-Seen',
      numberOfAyahs: 83,
      revelationType: 'Meccan'
    },
    55: {
      id: 55,
      name: 'الرحمن',
      englishName: 'Ar-Rahman',
      englishNameTranslation: 'The Beneficent',
      numberOfAyahs: 78,
      revelationType: 'Medinan'
    },
    67: {
      id: 67,
      name: 'الملك',
      englishName: 'Al-Mulk',
      englishNameTranslation: 'The Sovereignty',
      numberOfAyahs: 30,
      revelationType: 'Meccan'
    },
    112: {
      id: 112,
      name: 'الإخلاص',
      englishName: 'Al-Ikhlas',
      englishNameTranslation: 'The Sincerity',
      numberOfAyahs: 4,
      revelationType: 'Meccan'
    },
    113: {
      id: 113,
      name: 'الفلق',
      englishName: 'Al-Falaq',
      englishNameTranslation: 'The Daybreak',
      numberOfAyahs: 5,
      revelationType: 'Meccan'
    },
    114: {
      id: 114,
      name: 'الناس',
      englishName: 'An-Nas',
      englishNameTranslation: 'The Mankind',
      numberOfAyahs: 6,
      revelationType: 'Meccan'
    }
  };

  // If the requested surah is one of our fallback examples, return it
  if (commonSurahs[id]) {
    return commonSurahs[id];
  }

  // Otherwise, generate a basic placeholder for the requested surah ID
  return {
    id,
    name: `Surah ${id}`,
    englishName: `Surah ${id}`,
    englishNameTranslation: 'Unavailable Offline',
    numberOfAyahs: 1,
    revelationType: id <= 86 ? 'Meccan' : 'Medinan' // Approximation based on general pattern
  };
}

// Fallback data for the list of surahs if network request fails
function getFallbackSurahs(): Surah[] {
  // Generate a list of all 114 surahs with basic information
  const surahs: Surah[] = [];
  
  // Add common surahs with more detailed information
  surahs.push(getFallbackSurah(1)); // Al-Fatiha
  surahs.push(getFallbackSurah(2)); // Al-Baqarah
  surahs.push(getFallbackSurah(3)); // Aal-Imran
  
  // Fill in the rest with basic placeholders
  for (let i = 4; i <= 114; i++) {
    if (i === 36 || i === 55 || i === 67 || i === 112 || i === 113 || i === 114) {
      // Skip the common surahs we'll add with more details
      continue;
    }
    surahs.push({
      id: i,
      name: `سورة ${i}`,
      englishName: `Surah ${i}`,
      englishNameTranslation: 'Unavailable Offline',
      numberOfAyahs: 1, // Placeholder
      revelationType: i <= 86 ? 'Meccan' : 'Medinan' // Rough approximation
    });
  }
  
  // Add the remaining common surahs
  surahs.push(getFallbackSurah(36)); // Ya-Seen
  surahs.push(getFallbackSurah(55)); // Ar-Rahman
  surahs.push(getFallbackSurah(67)); // Al-Mulk
  surahs.push(getFallbackSurah(112)); // Al-Ikhlas
  surahs.push(getFallbackSurah(113)); // Al-Falaq
  surahs.push(getFallbackSurah(114)); // An-Nas
  
  // Sort by surah number
  surahs.sort((a, b) => a.id - b.id);
  
  return surahs;
}
