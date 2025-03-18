import { Hadith, sampleHadith, sampleHadiths } from './hadithTypes';

// This will store all loaded hadiths from the API
let cachedHadiths: Hadith[] = [];
let isDataLoaded = false;

// Function to load and process hadith data with pagination
export const loadHadithData = async (): Promise<void> => {
  if (isDataLoaded && cachedHadiths.length > 0) return;

  try {
    console.log("Starting to load Hadith data from new API source...");
    
    // For development/testing purposes, use sample data as we transition to the new API
    const useLocalSample = true; // Set this to false when The9Books API is integrated

    if (!useLocalSample) {
      // Here we would fetch from The9Books API
      // Implementation will be added when API structure is fully understood
      console.log("Fetching from The9Books API...");
      
      // Placeholder for The9Books API integration
      // const hadiths = await fetchFromThe9BooksAPI();
      // cachedHadiths = hadiths;
    } else {
      // Generate extended sample data for now
      console.log("Using sample data for Sahih Bukhari hadiths while transitioning to new API");
      cachedHadiths = generateSampleHadiths(100);
    }
    
    isDataLoaded = true;
    console.log(`Using ${cachedHadiths.length} hadiths for display`);
  } catch (error) {
    console.error("Failed to load hadith data:", error);
    // Use sample data as fallback
    cachedHadiths = generateSampleHadiths(50);
    isDataLoaded = true;
  }
};

// Function to generate a larger set of sample hadiths for testing
const generateSampleHadiths = (count: number): Hadith[] => {
  const hadiths: Hadith[] = [...sampleHadiths];
  
  // Add more sample hadiths to make navigation meaningful
  for (let book = 1; book <= 10; book++) {
    for (let i = 1; i <= 10; i++) {
      const hadithNum = (book - 1) * 10 + i;
      if (hadiths.length >= count) break;
      
      const newHadith = {
        id: hadiths.length + 1,
        collection: "Sahih Bukhari",
        bookNumber: book,
        chapterNumber: book,
        hadithNumber: hadithNum,
        arabic: sampleHadith.arabic,
        english: `This is sample hadith #${hadithNum} from Book ${book}. ${sampleHadith.english.substring(0, 100)}...`,
        reference: `Sahih Bukhari ${book}:${hadithNum}`,
        grade: "Sahih",
        narrator: sampleHadith.narrator || "Abu Hurairah"
      };
      hadiths.push(newHadith);
    }
    if (hadiths.length >= count) break;
  }
  
  return hadiths;
};

// Helper function for the future The9Books API integration
// This is a placeholder and will need to be implemented based on The9Books API structure
const fetchFromThe9BooksAPI = async (): Promise<Hadith[]> => {
  // Implementation will be added when API structure is fully understood
  return [];
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
    console.warn(`Hadith not found: ${collection} ${bookNumber}:${hadithNumber}, using first hadith of the book`);
    // Try to find any hadith from the same book
    const bookHadith = cachedHadiths.find(h => h.bookNumber === bookNumber);
    if (bookHadith) return bookHadith;
    
    return cachedHadiths[0] || sampleHadith;
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
