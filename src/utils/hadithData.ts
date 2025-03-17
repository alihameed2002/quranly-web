
import { Hadith, sampleHadith, sampleHadiths } from './hadithTypes';

// This will be replaced with actual data loaded from the Hadith API
let cachedHadiths: Hadith[] = [];
let isDataLoaded = false;
const API_KEY = '$2y$10$NgLZPFmKgeDlaivo0cn9wOJPqw7rfvmgNwiX9CHQXrHv6xjuV9pDa';
const API_ENDPOINT = 'https://hadithapi.com/api/hadiths/';

// Function to load and process hadith data
export const loadHadithData = async (): Promise<void> => {
  if (isDataLoaded && cachedHadiths.length > 0) return;

  try {
    console.log("Starting to load Hadith data from API...");
    
    // Process and deduplicate hadiths
    const hadiths: Hadith[] = [];
    const seen = new Set<string>();
    
    // First try the API endpoint
    try {
      const apiResponse = await fetch(`${API_ENDPOINT}?apiKey=${API_KEY}`);
      
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        console.log("API response data structure:", Object.keys(apiData));
        
        if (apiData.data && Array.isArray(apiData.data)) {
          console.log(`Retrieved ${apiData.data.length} hadiths from API`);
          
          apiData.data.forEach((item: any, index: number) => {
            // Create a key for deduplication based on both book and hadith number
            const bookNumber = item.bookNumber || item.chapterNumber || 0;
            const hadithNumber = item.hadithNumber || index + 1;
            const key = `${bookNumber}:${hadithNumber}`;
            
            if (!seen.has(key) && (item.text || item.englishText) && (item.arabic || item.arabicText)) {
              hadiths.push({
                id: index + 1,
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
        }
      } else {
        console.warn(`API response was not ok (status: ${apiResponse.status}), falling back to GitHub data`);
      }
    } catch (apiError) {
      console.error("Error fetching from primary API:", apiError);
    }
    
    console.log("Falling back to sample hadiths since API and GitHub repository failed");
    // If both API and GitHub repo fail, use sample data
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
