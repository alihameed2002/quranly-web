
import { Hadith, sampleHadith, sampleHadiths } from './hadithTypes';

// This will be replaced with actual data loaded from the Github repository
let cachedHadiths: Hadith[] = [];
let isDataLoaded = false;

// Function to load and process hadith data
export const loadHadithData = async (): Promise<void> => {
  if (isDataLoaded) return;

  try {
    // Load Bukhari hadiths
    const bukhariResponse = await fetch('https://raw.githubusercontent.com/AhmedBaset/hadith-json/main/bukhari_english.json');
    const bukhariData = await bukhariResponse.json();
    
    // Load Muslim hadiths
    const muslimResponse = await fetch('https://raw.githubusercontent.com/AhmedBaset/hadith-json/main/muslim_english.json');
    const muslimData = await muslimResponse.json();

    // Process and deduplicate hadiths
    const hadiths: Hadith[] = [];
    const seen = new Set<string>();

    // Process Bukhari hadiths
    bukhariData.forEach((item: any, index: number) => {
      // Create a key for deduplication
      const key = `${item.text}`;
      
      if (!seen.has(key) && item.text && item.text_ar) {
        hadiths.push({
          id: index + 1,
          collection: "Sahih Bukhari",
          bookNumber: item.book || 0,
          chapterNumber: item.chapter || 0,
          hadithNumber: item.hadith || 0,
          arabic: item.text_ar || "",
          english: item.text || "",
          reference: `Sahih Bukhari ${item.book || 0}:${item.hadith || 0}`,
          grade: item.grade || "Sahih"
        });
        seen.add(key);
      }
    });

    // Process Muslim hadiths
    muslimData.forEach((item: any, index: number) => {
      // Create a key for deduplication
      const key = `${item.text}`;
      
      if (!seen.has(key) && item.text && item.text_ar) {
        hadiths.push({
          id: bukhariData.length + index + 1,
          collection: "Sahih Muslim",
          bookNumber: item.book || 0,
          chapterNumber: item.chapter || 0,
          hadithNumber: item.hadith || 0,
          arabic: item.text_ar || "",
          english: item.text || "",
          reference: `Sahih Muslim ${item.book || 0}:${item.hadith || 0}`,
          grade: item.grade || "Sahih"
        });
        seen.add(key);
      }
    });

    cachedHadiths = hadiths;
    isDataLoaded = true;
    console.log(`Loaded ${hadiths.length} unique hadiths from Bukhari and Muslim collections`);
  } catch (error) {
    console.error("Failed to load hadith data:", error);
    // Use sample data as fallback
    cachedHadiths = sampleHadiths;
    isDataLoaded = true;
  }
};

// Function to get a specific hadith
export const fetchHadith = async (collection: string, bookNumber: number, hadithNumber: number): Promise<Hadith> => {
  await loadHadithData();
  
  const hadith = cachedHadiths.find(h => 
    h.collection === collection && 
    h.bookNumber === bookNumber && 
    h.hadithNumber === hadithNumber
  );
  
  return hadith || sampleHadith;
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

// Function to get the next hadith in sequence
export const getNextHadith = async (current: Hadith): Promise<Hadith> => {
  await loadHadithData();
  
  const currentIndex = cachedHadiths.findIndex(h => 
    h.collection === current.collection && 
    h.bookNumber === current.bookNumber && 
    h.hadithNumber === current.hadithNumber
  );
  
  if (currentIndex === -1 || currentIndex === cachedHadiths.length - 1) {
    return cachedHadiths[0] || sampleHadith;
  }
  
  return cachedHadiths[currentIndex + 1];
};

// Function to get the previous hadith in sequence
export const getPreviousHadith = async (current: Hadith): Promise<Hadith> => {
  await loadHadithData();
  
  const currentIndex = cachedHadiths.findIndex(h => 
    h.collection === current.collection && 
    h.bookNumber === current.bookNumber && 
    h.hadithNumber === current.hadithNumber
  );
  
  if (currentIndex <= 0) {
    return cachedHadiths[cachedHadiths.length - 1] || sampleHadith;
  }
  
  return cachedHadiths[currentIndex - 1];
};

// Load on module initialization
loadHadithData().catch(console.error);
