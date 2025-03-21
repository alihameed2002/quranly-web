// Quran data fetching utilities for offline caching

import { getOfflineData } from '@/utils/offlineStorage';

// API base URL
const API_BASE_URL = 'https://api.alquran.cloud/v1';

/**
 * Clean up verse translation text by removing unwanted HTML tags and footnotes
 */
function cleanTranslationText(text: string): string {
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

// Types
interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  hizbQuarter: number;
  sajda: boolean;
}

interface QuranData {
  surahs: Surah[];
  verses: Record<number, Ayah[]>;
  translations?: Record<string, any>;
}

// Check if the device is online
function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

// Sample surahs for fallback when offline with no cached data
const FALLBACK_SURAHS: Surah[] = [
  {
    number: 1,
    name: 'الفاتحة',
    englishName: 'Al-Fatiha',
    englishNameTranslation: 'The Opening',
    numberOfAyahs: 7,
    revelationType: 'Meccan'
  },
  {
    number: 2,
    name: 'البقرة',
    englishName: 'Al-Baqarah',
    englishNameTranslation: 'The Cow',
    numberOfAyahs: 286,
    revelationType: 'Medinan'
  },
  {
    number: 112,
    name: 'الإخلاص',
    englishName: 'Al-Ikhlas',
    englishNameTranslation: 'Sincerity',
    numberOfAyahs: 4,
    revelationType: 'Meccan'
  },
  {
    number: 113,
    name: 'الفلق',
    englishName: 'Al-Falaq',
    englishNameTranslation: 'The Daybreak',
    numberOfAyahs: 5,
    revelationType: 'Meccan'
  },
  {
    number: 114,
    name: 'الناس',
    englishName: 'An-Nas',
    englishNameTranslation: 'Mankind',
    numberOfAyahs: 6,
    revelationType: 'Meccan'
  }
];

// Fallback verses for surah Al-Fatiha when offline with no cached data
const FALLBACK_VERSES: Record<number, Ayah[]> = {
  1: [
    {
      number: 1,
      text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      numberInSurah: 1,
      juz: 1,
      page: 1,
      hizbQuarter: 1,
      sajda: false
    },
    {
      number: 2,
      text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      numberInSurah: 2,
      juz: 1,
      page: 1,
      hizbQuarter: 1,
      sajda: false
    },
    {
      number: 3,
      text: 'الرَّحْمَٰنِ الرَّحِيمِ',
      numberInSurah: 3,
      juz: 1,
      page: 1,
      hizbQuarter: 1,
      sajda: false
    },
    {
      number: 4,
      text: 'مَالِكِ يَوْمِ الدِّينِ',
      numberInSurah: 4,
      juz: 1,
      page: 1,
      hizbQuarter: 1,
      sajda: false
    },
    {
      number: 5,
      text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      numberInSurah: 5,
      juz: 1,
      page: 1,
      hizbQuarter: 1,
      sajda: false
    },
    {
      number: 6,
      text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      numberInSurah: 6,
      juz: 1,
      page: 1,
      hizbQuarter: 1,
      sajda: false
    },
    {
      number: 7,
      text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      numberInSurah: 7,
      juz: 1,
      page: 1,
      hizbQuarter: 1,
      sajda: false
    }
  ]
};

// Fetch all Quran data (surahs and verses)
export async function fetchQuranData(): Promise<QuranData> {
  try {
    // Try to get all necessary data from offline storage first
    const offlineSurahs = await getOfflineData('quran', 'surah-list').catch(() => null);
    
    // Collection to hold verses we find in offline storage
    const offlineVerses: Record<number, Ayah[]> = {};
    const offlineTranslations: Record<string, any> = {};
    
    // If we have surahs in offline storage, try to get verses for each surah
    if (offlineSurahs && Array.isArray(offlineSurahs)) {
      // If we're offline, prioritize getting all available offline data immediately
      if (!isOnline()) {
        console.log('Device is offline, loading all available offline Quran data');
        
        // Try to load verses for each surah from offline storage
        for (const surah of offlineSurahs) {
          try {
            const verses = await getOfflineData('quran', `verses-${surah.number}`).catch(() => null);
            if (verses && Array.isArray(verses)) {
              offlineVerses[surah.number] = verses;
            }
            
            // Try to get translation if available
            const translation = await getOfflineData('quran', `translation-${surah.number}-en.sahih`).catch(() => null);
            if (translation) {
              offlineTranslations[`${surah.number}-en.sahih`] = translation;
            }
          } catch (err) {
            console.error(`Error fetching offline verses for surah ${surah.number}:`, err);
          }
        }
        
        // Return whatever offline data we have
        return {
          surahs: offlineSurahs,
          verses: offlineVerses,
          translations: offlineTranslations
        };
      }
    }
    
    // If online, try to fetch from network but keep offline data as fallback
    if (isOnline()) {
      try {
        console.log('Fetching Quran data from API');
        
        // Step 1: Fetch surah list 
        const surahs = await fetchSurahs();
        
        // Step 2: Fetch all verses by surah
        const verses: Record<number, Ayah[]> = {};
        
        // Use a limited set of surahs for initial load to avoid too many API requests
        // In a real app, you might want to batch this or load on demand
        const surahsToFetch = surahs.slice(0, 10); // First 10 surahs
        
        await Promise.all(
          surahsToFetch.map(async (surah: Surah) => {
            try {
              const surahVerses = await fetchSurahVerses(surah.number);
              verses[surah.number] = surahVerses;
            } catch (error) {
              console.error(`Error fetching verses for surah ${surah.number}:`, error);
              
              // Try to get from offline storage as fallback
              const offlineVerses = await getOfflineData('quran', `verses-${surah.number}`).catch(() => null);
              if (offlineVerses) {
                verses[surah.number] = offlineVerses;
              }
            }
          })
        );
        
        // Step 3: Fetch English translation for first few surahs
        const translations: Record<string, any> = {};
        
        await Promise.all(
          surahsToFetch.slice(0, 5).map(async (surah: Surah) => {
            try {
              const translationEdition = 'en.sahih'; // Sahih International English translation
              
              // Try to get from offline storage first
              const offlineTranslation = await getOfflineData('quran', `translation-${surah.number}-${translationEdition}`).catch(() => null);
              if (offlineTranslation) {
                translations[`${surah.number}-${translationEdition}`] = offlineTranslation;
                return;
              }
              
              // If not available offline, fetch from API
              const translationResponse = await fetch(
                `${API_BASE_URL}/surah/${surah.number}/${translationEdition}`
              );
              
              if (!translationResponse.ok) {
                throw new Error(`Failed to fetch translation: ${translationResponse.statusText}`);
              }
              
              const translationData = await translationResponse.json();
              if (translationData.code === 200 && translationData.data) {
                translations[`${surah.number}-${translationEdition}`] = translationData.data.ayahs.map(
                  (ayah: any) => ({
                    number: ayah.number,
                    numberInSurah: ayah.numberInSurah,
                    text: cleanTranslationText(ayah.text)
                  })
                );
              }
            } catch (error) {
              console.error(`Error fetching translation for surah ${surah.number}:`, error);
            }
          })
        );
        
        return {
          surahs,
          verses,
          translations
        };
      } catch (networkError) {
        console.error('Network error fetching Quran data:', networkError);
        
        // Fall back to offline data if available
        if (offlineSurahs && Array.isArray(offlineSurahs)) {
          console.log('Falling back to cached Quran data');
          return {
            surahs: offlineSurahs,
            verses: offlineVerses,
            translations: offlineTranslations
          };
        }
        
        // Last resort fallback - provide minimal static data
        return {
          surahs: FALLBACK_SURAHS,
          verses: FALLBACK_VERSES,
          translations: {}
        };
      }
    }
    
    // If we reach here, we're offline but have some offline data
    if (offlineSurahs && Array.isArray(offlineSurahs)) {
      console.log('Using cached Quran data (offline)');
      return {
        surahs: offlineSurahs,
        verses: offlineVerses,
        translations: offlineTranslations
      };
    }
    
    // Last resort - provide minimal static data
    console.log('Using fallback Quran data (offline with no cache)');
    return {
      surahs: FALLBACK_SURAHS,
      verses: FALLBACK_VERSES,
      translations: {}
    };
  } catch (error) {
    console.error('Error fetching Quran data:', error);
    
    // Last resort fallback - provide minimal static data
    return {
      surahs: FALLBACK_SURAHS,
      verses: FALLBACK_VERSES,
      translations: {}
    };
  }
}

// Fetch all surahs (chapters) of the Quran
export async function fetchSurahs(): Promise<Surah[]> {
  try {
    // Try to get from offline storage first
    const offlineData = await getOfflineData('quran', 'surah-list').catch(() => null);
    
    // If we have offline data and we're offline, use it immediately 
    if (offlineData && !isOnline()) {
      console.log('Using cached surah list (offline)');
      return offlineData;
    }
    
    // If we're online, try to fetch from network
    if (isOnline()) {
      try {
        console.log('Fetching surah list from API');
        const response = await fetch(`${API_BASE_URL}/surah`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch surahs: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.code === 200 && Array.isArray(data.data)) {
          const surahs = data.data.map((surah: any) => ({
            number: surah.number,
            name: surah.name,
            englishName: surah.englishName,
            englishNameTranslation: surah.englishNameTranslation,
            numberOfAyahs: surah.numberOfAyahs,
            revelationType: surah.revelationType
          }));
          
          return surahs;
        } else {
          throw new Error('Invalid surah data format from API');
        }
      } catch (networkError) {
        console.error('Network error fetching surahs:', networkError);
        
        // Fall back to offline data if available
        if (offlineData) {
          console.log('Falling back to cached surah list');
          return offlineData;
        }
        
        // Last resort fallback
        return FALLBACK_SURAHS;
      }
    }
    
    // If we reach here, we're offline but have offline data
    if (offlineData) {
      console.log('Using cached surah list (offline)');
      return offlineData;
    }
    
    // Last resort fallback
    console.log('Using fallback surah list (offline with no cache)');
    return FALLBACK_SURAHS;
  } catch (error) {
    console.error('Error fetching surahs:', error);
    
    // Last resort fallback
    return FALLBACK_SURAHS;
  }
}

// Fetch verses for a specific surah
export async function fetchSurahVerses(surahNumber: number): Promise<Ayah[]> {
  try {
    // Try to get from offline storage first
    const offlineData = await getOfflineData('quran', `verses-${surahNumber}`).catch(() => null);
    
    // If we have offline data and we're offline, use it immediately
    if (offlineData && !isOnline()) {
      console.log(`Using cached verses for surah ${surahNumber} (offline)`);
      return offlineData;
    }
    
    // If we're online, try to fetch from API
    if (isOnline()) {
      try {
        console.log(`Fetching verses for surah ${surahNumber} from API`);
        const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch verses: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.code === 200 && data.data && Array.isArray(data.data.ayahs)) {
          return data.data.ayahs.map((ayah: any) => ({
            number: ayah.number,
            text: ayah.text,
            numberInSurah: ayah.numberInSurah,
            juz: ayah.juz,
            page: ayah.page,
            hizbQuarter: ayah.hizbQuarter,
            sajda: !!ayah.sajda
          }));
        } else {
          throw new Error('Invalid verse data format from API');
        }
      } catch (networkError) {
        console.error(`Network error fetching verses for surah ${surahNumber}:`, networkError);
        
        // Fall back to offline data if available
        if (offlineData) {
          console.log(`Falling back to cached verses for surah ${surahNumber}`);
          return offlineData;
        }
        
        // Last resort fallback for Al-Fatiha
        if (surahNumber === 1 && FALLBACK_VERSES[1]) {
          return FALLBACK_VERSES[1];
        }
        
        // For other surahs, create a placeholder verse
        return [{
          number: 1,
          text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          numberInSurah: 1,
          juz: 1,
          page: 1,
          hizbQuarter: 1,
          sajda: false
        }];
      }
    }
    
    // If we reach here, we're offline but have offline data
    if (offlineData) {
      console.log(`Using cached verses for surah ${surahNumber} (offline)`);
      return offlineData;
    }
    
    // Last resort fallback for Al-Fatiha
    if (surahNumber === 1 && FALLBACK_VERSES[1]) {
      console.log(`Using fallback verses for surah ${surahNumber} (offline with no cache)`);
      return FALLBACK_VERSES[1];
    }
    
    // For other surahs, create a placeholder verse
    return [{
      number: 1,
      text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      numberInSurah: 1,
      juz: 1,
      page: 1,
      hizbQuarter: 1,
      sajda: false
    }];
  } catch (error) {
    console.error(`Error fetching verses for surah ${surahNumber}:`, error);
    
    // Last resort fallback for Al-Fatiha
    if (surahNumber === 1 && FALLBACK_VERSES[1]) {
      return FALLBACK_VERSES[1];
    }
    
    // For other surahs, create a placeholder verse
    return [{
      number: 1,
      text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      numberInSurah: 1,
      juz: 1,
      page: 1,
      hizbQuarter: 1,
      sajda: false
    }];
  }
} 