
import { Hadith, sampleHadith, sampleHadiths } from './hadithTypes';

// This will store all loaded hadiths from the API
let cachedHadiths: Hadith[] = [];
let isDataLoaded = false;
const API_KEY = '$2y$10$NgLZPFmKgeDlaivo0cn9wOJPqw7rfvmgNwiX9CHQXrHv6xjuV9pDa';
const API_ENDPOINT = 'https://hadithapi.com/api/hadiths/';

// Function to load and process hadith data with pagination
export const loadHadithData = async (): Promise<void> => {
  if (isDataLoaded && cachedHadiths.length > 0) return;

  try {
    console.log("Starting to load Hadith data from API...");
    
    // Process and deduplicate hadiths
    const hadiths: Hadith[] = [];
    const seen = new Set<string>();
    
    // Paginate through the API to get all hadiths
    let page = 1;
    let hasMorePages = true;
    const pageSize = 100; // Number of hadiths per page
    
    while (hasMorePages) {
      try {
        const apiUrl = `${API_ENDPOINT}?apiKey=${API_KEY}&book=sahih-bukhari&paginate=${pageSize}&page=${page}`;
        console.log(`Fetching page ${page} of hadiths...`);
        
        const apiResponse = await fetch(apiUrl);
        
        if (apiResponse.ok) {
          const apiData = await apiResponse.json();
          
          if (apiData.data && Array.isArray(apiData.data)) {
            console.log(`Retrieved ${apiData.data.length} hadiths from API (page ${page})`);
            
            if (apiData.data.length === 0) {
              hasMorePages = false;
              break;
            }
            
            apiData.data.forEach((item: any, index: number) => {
              // Create a key for deduplication based on both book and hadith number
              const bookNumber = item.bookNumber || item.chapterNumber || 0;
              const hadithNumber = item.hadithNumber || ((page - 1) * pageSize + index + 1);
              const key = `${bookNumber}:${hadithNumber}`;
              
              if (!seen.has(key) && (item.text || item.englishText) && (item.arabic || item.arabicText)) {
                hadiths.push({
                  id: (page - 1) * pageSize + index + 1,
                  collection: "Sahih Bukhari",
                  bookNumber: parseInt(bookNumber) || 0,
                  chapterNumber: parseInt(bookNumber) || 0,
                  hadithNumber: parseInt(hadithNumber) || 0,
                  arabic: item.arabic || item.arabicText || "",
                  english: item.text || item.englishText || "",
                  reference: `Sahih Bukhari ${bookNumber || 0}:${hadithNumber || 0}`,
                  grade: item.grade || "Sahih",
                  narrator: item.narrator || ""
                });
                seen.add(key);
              }
            });
            
            // Check if we should continue paginating
            if (apiData.meta && apiData.meta.pagination) {
              const { current_page, last_page } = apiData.meta.pagination;
              if (current_page >= last_page) {
                hasMorePages = false;
              } else {
                page++;
              }
            } else {
              // If pagination info is missing, assume no more pages
              hasMorePages = false;
            }
          } else {
            hasMorePages = false;
          }
        } else {
          console.warn(`API response was not ok (status: ${apiResponse.status}), halting pagination`);
          hasMorePages = false;
        }
      } catch (pageError) {
        console.error(`Error fetching page ${page}:`, pageError);
        hasMorePages = false;
      }
    }
    
    if (hadiths.length > 0) {
      console.log(`Successfully loaded ${hadiths.length} hadiths from API`);
      
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
      return;
    }
    
    console.log("Failed to load hadiths from API, using sample data instead");
    // If API fails, use sample data
    cachedHadiths = sampleHadiths;
    
    // Add more sample hadiths to make navigation meaningful
    for (let i = 0; i < 10; i++) {
      const newHadith = {
        ...sampleHadith,
        id: sampleHadiths.length + i + 1,
        hadithNumber: sampleHadith.hadithNumber + i + 1,
        english: `${sampleHadith.english} (Sample ${i + 1})`,
        reference: `Sahih Bukhari ${sampleHadith.bookNumber}:${sampleHadith.hadithNumber + i + 1}`
      };
      cachedHadiths.push(newHadith);
    }
    
    isDataLoaded = true;
    console.log(`Using ${cachedHadiths.length} sample hadiths for demonstration`);
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

// Function to get all hadith chapters/books
export const getHadithChapters = async (): Promise<{id: number, name: string, hadithCount: number}[]> => {
  await loadHadithData();
  
  if (cachedHadiths.length === 0) return [];
  
  // Group hadiths by book number
  const bookMap = new Map<number, number>();
  
  cachedHadiths.forEach(hadith => {
    if (!bookMap.has(hadith.bookNumber)) {
      bookMap.set(hadith.bookNumber, 1);
    } else {
      bookMap.set(hadith.bookNumber, (bookMap.get(hadith.bookNumber) || 0) + 1);
    }
  });
  
  // Convert to array of chapter objects
  return Array.from(bookMap.entries()).map(([bookNumber, count]) => ({
    id: bookNumber,
    name: `Book ${bookNumber}`,
    hadithCount: count
  })).sort((a, b) => a.id - b.id);
};

// Function to get hadiths for a specific chapter/book
export const getHadithsByChapter = async (bookNumber: number): Promise<Hadith[]> => {
  await loadHadithData();
  
  return cachedHadiths.filter(h => h.bookNumber === bookNumber)
    .sort((a, b) => a.hadithNumber - b.hadithNumber);
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

// Function to get the next hadith in sequence
export const getNextHadith = async (current: Hadith): Promise<Hadith> => {
  await loadHadithData();
  
  if (cachedHadiths.length === 0) {
    console.warn("No hadiths loaded, returning sample hadith");
    return current; // Return current hadith instead of sample to avoid navigation issues
  }
  
  const currentIndex = cachedHadiths.findIndex(h => 
    h.collection === current.collection && 
    h.bookNumber === current.bookNumber && 
    h.hadithNumber === current.hadithNumber
  );
  
  console.log(`Current hadith index: ${currentIndex}, total hadiths: ${cachedHadiths.length}`);
  
  // If current hadith not found or is the last one, return the same hadith
  if (currentIndex === -1 || currentIndex === cachedHadiths.length - 1) {
    console.log("User is at the last hadith or hadith not found, staying on current");
    return current;
  }
  
  console.log(`Moving from hadith at index ${currentIndex} to ${currentIndex + 1}`);
  return cachedHadiths[currentIndex + 1];
};

// Function to get the previous hadith in sequence
export const getPreviousHadith = async (current: Hadith): Promise<Hadith> => {
  await loadHadithData();
  
  if (cachedHadiths.length === 0) {
    console.warn("No hadiths loaded, returning sample hadith");
    return current; // Return current hadith instead of sample to avoid navigation issues
  }
  
  const currentIndex = cachedHadiths.findIndex(h => 
    h.collection === current.collection && 
    h.bookNumber === current.bookNumber && 
    h.hadithNumber === current.hadithNumber
  );
  
  console.log(`Current hadith index: ${currentIndex}, total hadiths: ${cachedHadiths.length}`);
  
  // If current hadith not found or is the first one, return the same hadith
  if (currentIndex <= 0) {
    console.log("User is at the first hadith or hadith not found, staying on current");
    return current;
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
