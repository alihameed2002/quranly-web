import { Verse, extendedSampleVerses } from './quranTypes';
import { fetchStaticQuranData } from './verseFetching';
import { fetchSurahs } from './surahFetching';
import { getAllVerses } from './indexedDB';

// Cache management for full Quran data
let fullQuranData: Verse[] = [];
let isQuranDataLoading = false;
let quranDataLoadPromise: Promise<Verse[]> | null = null;
let lastDataLoad: number = 0;
const DATA_CACHE_LIFETIME = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

// Function to fetch the full Quran text for search with proper caching
export const fetchFullQuranData = async (): Promise<Verse[]> => {
  // If we already have valid cached data, return it immediately
  const now = Date.now();
  if (fullQuranData.length > 0 && (now - lastDataLoad) < DATA_CACHE_LIFETIME) {
    console.log("Using cached Quran data from memory");
    return fullQuranData;
  }

  // If a fetch is already in progress, return the existing promise
  if (isQuranDataLoading && quranDataLoadPromise) {
    console.log("Quran data load in progress, returning existing promise");
    return quranDataLoadPromise;
  }

  // Set loading flag and create a new promise
  isQuranDataLoading = true;
  console.log("Fetching full Quran data for search...");

  // Create and store the promise for potential concurrent requests
  quranDataLoadPromise = new Promise<Verse[]>(async (resolve) => {
    try {
      // First try to get from IndexedDB
      const versesFromDB = await getAllVerses();
      if (versesFromDB && versesFromDB.length > 0) {
        console.log(`Retrieved ${versesFromDB.length} verses from IndexedDB`);
        fullQuranData = versesFromDB;
        lastDataLoad = Date.now();
        resolve(fullQuranData);
        isQuranDataLoading = false;
        quranDataLoadPromise = null;
        return;
      }
      
      // If not in IndexedDB, try to fetch from the static JSON source
      let verses: Verse[] = [];
      
      try {
        verses = await fetchStaticQuranData();
      } catch (staticError) {
        console.warn("Static data fetch failed, falling back to API:", staticError);
        
        // If static JSON fails, fallback to fetching from API
        const surahs = await fetchSurahs();
        
        // Process surahs in batches to avoid overwhelming the API
        const BATCH_SIZE = 10;
        for (let i = 0; i < surahs.length; i += BATCH_SIZE) {
          const batch = surahs.slice(i, i + BATCH_SIZE);
          
          // Process batch in parallel
          const batchPromises = batch.map(async (surah) => {
            try {
              const response = await fetch(`https://api.alquran.cloud/v1/surah/${surah.id}/en.sahih`);
              const data = await response.json();
              
              if (data.code === 200 && data.data && data.data.ayahs) {
                return data.data.ayahs.map((ayah: any, index: number) => ({
                  id: (surah.id * 1000) + (index + 1),
                  surah: surah.id,
                  ayah: index + 1,
                  arabic: "", // We'll fetch Arabic text separately if needed
                  translation: ayah.text,
                  surahName: surah.englishName,
                  totalVerses: surah.numberOfAyahs
                }));
              }
              return [];
            } catch (error) {
              console.error(`Error fetching verses for Surah ${surah.id}:`, error);
              return [];
            }
          });
          
          const batchResults = await Promise.all(batchPromises);
          batchResults.forEach(surahVerses => {
            verses.push(...surahVerses);
          });
          
          console.log(`Loaded ${verses.length} verses so far (processed ${i + batch.length} of ${surahs.length} surahs)`);
          
          // Small delay between batches to avoid rate limiting
          await new Promise(r => setTimeout(r, 500));
        }
      }
      
      if (verses.length > 0) {
        fullQuranData = verses;
        lastDataLoad = Date.now();
        console.log(`Loaded ${verses.length} verses for search`);
      } else {
        // Fallback to sample data if both methods fail
        console.warn("All data fetch methods failed, using sample data instead");
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
