
import { Hadith, sampleHadith, sampleHadiths } from './hadithTypes';

// This will be replaced with actual data loaded from the Github repository
let cachedHadiths: Hadith[] = [];
let isDataLoaded = false;
const API_KEY = '$2y$10$NgLZPFmKgeDlaivo0cn9wOJPqw7rfvmgNwiX9CHQXrHv6xjuV9pDa';
const TOTAL_HADITHS = 7563; // Total number of hadiths in Sahih Bukhari
const HADITHS_PER_PAGE = 50; // Number of hadiths to fetch per API call

// Function to load and process hadith data
export const loadHadithData = async (): Promise<void> => {
  if (isDataLoaded && cachedHadiths.length > 0) return;

  try {
    console.log("Starting to load Hadith data from API...");
    
    // Process and deduplicate hadiths
    const hadiths: Hadith[] = [];
    const seen = new Set<string>();
    
    // We'll use the Github repository data as it's more reliable and complete
    const bukhariResponse = await fetch('https://raw.githubusercontent.com/AhmedBaset/hadith-json/main/db/by_book/the_9_books/bukhari.json');
    
    if (!bukhariResponse.ok) {
      throw new Error(`Failed to fetch hadith data: ${bukhariResponse.status}`);
    }
    
    const bukhariData = await bukhariResponse.json();
    
    // Process Bukhari hadiths - the structure might be different in this file
    if (Array.isArray(bukhariData.hadiths)) {
      bukhariData.hadiths.forEach((item: any, index: number) => {
        // Create a key for deduplication based on both book and hadith number
        const key = `${item.chapterNumber}:${item.hadithNumber}`;
        
        if (!seen.has(key) && item.text && item.arabic) {
          hadiths.push({
            id: index + 1,
            collection: "Sahih Bukhari",
            bookNumber: parseInt(item.chapterNumber) || 0,
            chapterNumber: parseInt(item.chapterNumber) || 0,
            hadithNumber: parseInt(item.hadithNumber) || 0,
            arabic: item.arabic || "",
            english: item.text || "",
            reference: `Sahih Bukhari ${item.chapterNumber || 0}:${item.hadithNumber || 0}`,
            grade: "Sahih"
          });
          seen.add(key);
        }
      });
    } else {
      console.error("Unexpected data structure in Bukhari hadiths JSON");
    }

    // Sort hadiths chronologically by book number and hadith number
    hadiths.sort((a, b) => {
      // First compare by book number
      if (a.bookNumber !== b.bookNumber) {
        return a.bookNumber - b.bookNumber;
      }
      // If book numbers are the same, compare by hadith number
      return a.hadithNumber - b.hadithNumber;
    });

    cachedHadiths = hadiths;
    isDataLoaded = true;
    console.log(`Loaded ${hadiths.length} unique hadiths from Sahih Bukhari collection in chronological order`);
  } catch (error) {
    console.error("Failed to load hadith data:", error);
    // Use sample data as fallback
    cachedHadiths = sampleHadiths;
    isDataLoaded = true;
  }
};

// Function to get all hadiths (useful for pagination)
export const getAllHadiths = async (): Promise<Hadith[]> => {
  await loadHadithData();
  return cachedHadiths;
};

// Function to get total number of hadiths
export const getTotalHadithCount = async (): Promise<number> => {
  await loadHadithData();
  return cachedHadiths.length;
};

// Function to get a specific hadith by index (for pagination)
export const getHadithByIndex = async (index: number): Promise<Hadith> => {
  await loadHadithData();
  
  if (cachedHadiths.length === 0) return sampleHadith;
  
  // Ensure index is within bounds
  const safeIndex = Math.max(0, Math.min(index, cachedHadiths.length - 1));
  return cachedHadiths[safeIndex];
};

// Function to get a specific hadith
export const fetchHadith = async (collection: string, bookNumber: number, hadithNumber: number): Promise<Hadith> => {
  await loadHadithData();
  
  if (cachedHadiths.length === 0) {
    console.warn("No hadiths loaded, returning sample hadith");
    return sampleHadith;
  }
  
  const hadith = cachedHadiths.find(h => 
    h.collection === collection && 
    h.bookNumber === bookNumber && 
    h.hadithNumber === hadithNumber
  );
  
  if (!hadith) {
    console.warn(`Hadith not found: ${collection} ${bookNumber}:${hadithNumber}`);
    return sampleHadith;
  }
  
  return hadith;
};

// Function to get hadith index from collection, book, and hadith number
export const getHadithIndex = async (collection: string, bookNumber: number, hadithNumber: number): Promise<number> => {
  await loadHadithData();
  
  const index = cachedHadiths.findIndex(h => 
    h.collection === collection && 
    h.bookNumber === bookNumber && 
    h.hadithNumber === hadithNumber
  );
  
  return index >= 0 ? index : 0;
};

// Fixed: Function to get the next hadith in sequence
export const getNextHadith = async (current: Hadith): Promise<Hadith> => {
  await loadHadithData();
  
  if (cachedHadiths.length === 0) {
    console.warn("No hadiths loaded, returning sample hadith");
    return sampleHadith;
  }
  
  const currentIndex = cachedHadiths.findIndex(h => 
    h.collection === current.collection && 
    h.bookNumber === current.bookNumber && 
    h.hadithNumber === current.hadithNumber
  );
  
  // If index not found or it's the last hadith, loop to first hadith
  if (currentIndex === -1 || currentIndex === cachedHadiths.length - 1) {
    console.log("Returning first hadith (loop from end to beginning)");
    return cachedHadiths[0];
  }
  
  console.log(`Moving from hadith at index ${currentIndex} to ${currentIndex + 1}`);
  return cachedHadiths[currentIndex + 1];
};

// Fixed: Function to get the previous hadith in sequence
export const getPreviousHadith = async (current: Hadith): Promise<Hadith> => {
  await loadHadithData();
  
  if (cachedHadiths.length === 0) {
    console.warn("No hadiths loaded, returning sample hadith");
    return sampleHadith;
  }
  
  const currentIndex = cachedHadiths.findIndex(h => 
    h.collection === current.collection && 
    h.bookNumber === current.bookNumber && 
    h.hadithNumber === current.hadithNumber
  );
  
  // If index not found or it's the first hadith, loop to last hadith
  if (currentIndex <= 0) {
    console.log("Returning last hadith (loop from beginning to end)");
    return cachedHadiths[cachedHadiths.length - 1];
  }
  
  console.log(`Moving from hadith at index ${currentIndex} to ${currentIndex - 1}`);
  return cachedHadiths[currentIndex - 1];
};

// Function to search hadiths
export const searchHadith = async (query: string): Promise<Hadith[]> => {
  await loadHadithData();
  
  if (!query) return [];
  
  const searchTerms = query.toLowerCase().split(' ');
  
  return cachedHadiths.filter(hadith => {
    const englishText = hadith.english.toLowerCase();
    return searchTerms.every(term => englishText.includes(term));
  });
};

// Function to get a random hadith
export const getRandomHadith = async (): Promise<Hadith> => {
  await loadHadithData();
  
  if (cachedHadiths.length === 0) return sampleHadith;
  
  const randomIndex = Math.floor(Math.random() * cachedHadiths.length);
  return cachedHadiths[randomIndex];
};

// Load on module initialization
loadHadithData().catch(console.error);
