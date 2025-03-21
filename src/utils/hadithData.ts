import { Hadith } from './hadithTypes';
import { 
  fetchBooks, 
  fetchHadithsByBook, 
  fetchHadithByNumber,
  searchHadithsInThe9Books
} from './the9BooksApi';

// This will store all loaded hadiths from the API
let cachedHadiths: Hadith[] = [];
let isDataLoaded = false;
let isFetchingInProgress = false;
let currentActiveCollection = 'bukhari'; // Default to Bukhari

// Function to load hadith data from The9Books API
export const loadHadithData = async (
  collectionId: string = currentActiveCollection,
  forceRefresh: boolean = false
): Promise<void> => {
  if ((isDataLoaded && !forceRefresh) || isFetchingInProgress) return;

  try {
    console.log(`Loading Hadith data from The9Books API for collection: ${collectionId}...`);
    isFetchingInProgress = true;
    
    // Set active collection
    currentActiveCollection = collectionId;
    
    // Get all books in the collection
    const books = await fetchBooks(collectionId);
    console.log(`Loaded ${books.length} books from collection ${collectionId}`);
    
    // For initial load, we'll fetch hadiths from first few books to display something quickly
    // Later we can implement lazy loading for the rest
    const initialBooksToLoad = Math.min(5, books.length);
    const loadedHadiths: Hadith[] = [];
    
    for (let i = 0; i < initialBooksToLoad; i++) {
      const book = books[i];
      console.log(`Fetching hadiths from book ${book.id}: ${book.name}`);
      
      try {
        const hadiths = await fetchHadithsByBook(collectionId, book.id);
        loadedHadiths.push(...hadiths);
        console.log(`Loaded ${hadiths.length} hadiths from book ${book.id}`);
      } catch (error) {
        console.error(`Failed to load hadiths from book ${book.id}:`, error);
      }
    }
    
    // Replace cached hadiths if we got new data
    if (loadedHadiths.length > 0) {
      cachedHadiths = loadedHadiths;
    }
    
    isDataLoaded = true;
    console.log(`Loaded ${cachedHadiths.length} hadiths in total for collection ${collectionId}`);
  } catch (error) {
    console.error("Failed to load hadith data:", error);
    throw error;
  } finally {
    isFetchingInProgress = false;
  }
};

// Get all hadiths (with support for pagination in the future)
export const getAllHadiths = async (): Promise<Hadith[]> => {
  try {
    await loadHadithData();
    return cachedHadiths;
  } catch (error) {
    console.error("Error in getAllHadiths:", error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};

// Get total number of hadiths
export const getTotalHadithCount = async (): Promise<number> => {
  try {
    await loadHadithData();
    return cachedHadiths.length;
  } catch (error) {
    console.error("Error in getTotalHadithCount:", error);
    return 0;
  }
};

// Get a specific hadith by index (for pagination)
export const getHadithByIndex = async (index: number): Promise<Hadith> => {
  try {
    await loadHadithData();
    
    if (cachedHadiths.length === 0) {
      throw new Error("No hadiths loaded");
    }
    
    // Ensure index is valid
    const safeIndex = Math.max(0, Math.min(index, cachedHadiths.length - 1));
    
    return cachedHadiths[safeIndex];
  } catch (error) {
    console.error("Error in getHadithByIndex:", error);
    // Return a placeholder hadith
    return {
      id: "0", // Ensure ID is a string
      collection: currentActiveCollection,
      bookNumber: "1",
      chapterNumber: "1",
      hadithNumber: "1",
      arabic: 'Error loading hadith',
      english: 'There was an error loading this hadith. Please try again later.',
      reference: `${currentActiveCollection} 1:1`,
      grade: '',
      narrator: ''
    };
  }
};

// Get all hadith chapters/books
export const getHadithChapters = async (collectionId: string = currentActiveCollection): Promise<{id: string, name: string, hadithCount: number}[]> => {
  try {
    // Always fetch fresh book data from API
    const books = await fetchBooks(collectionId);
    return books;
  } catch (error) {
    console.error("Failed to load hadith chapters:", error);
    
    // If we have cached hadiths, we can try to extract books from there
    if (cachedHadiths.length > 0) {
      const bookMap = new Map<string, number>();
      
      cachedHadiths.forEach(hadith => {
        if (!bookMap.has(hadith.bookNumber)) {
          bookMap.set(hadith.bookNumber, 1);
        } else {
          bookMap.set(hadith.bookNumber, (bookMap.get(hadith.bookNumber) || 0) + 1);
        }
      });
      
      return Array.from(bookMap.entries()).map(([bookNumber, count]) => ({
        id: bookNumber,
        name: `Book ${bookNumber}`,
        hadithCount: count
      })).sort((a, b) => parseInt(a.id) - parseInt(b.id));
    }
    
    return [];
  }
};

// Get hadiths for a specific chapter/book
export const getHadithsByChapter = async (
  bookNumber: string, 
  collectionId: string = currentActiveCollection
): Promise<Hadith[]> => {
  try {
    // Always fetch fresh data for specific book
    const hadiths = await fetchHadithsByBook(collectionId, bookNumber);
    
    // Add to cache if not already there
    if (hadiths.length > 0) {
      // Add only unique hadiths to cache
      hadiths.forEach(hadith => {
        if (!cachedHadiths.some(h => 
          h.collection === hadith.collection && 
          h.bookNumber === hadith.bookNumber && 
          h.hadithNumber === hadith.hadithNumber
        )) {
          cachedHadiths.push(hadith);
        }
      });
    }
    
    return hadiths.sort((a, b) => parseInt(a.hadithNumber) - parseInt(b.hadithNumber));
  } catch (error) {
    console.error(`Failed to get hadiths for book ${bookNumber}:`, error);
    
    // Fallback to cached hadiths if available
    return cachedHadiths
      .filter(h => h.bookNumber === bookNumber)
      .sort((a, b) => parseInt(a.hadithNumber) - parseInt(b.hadithNumber));
  }
};

// Get a specific hadith
export const fetchHadith = async (
  collection: string = currentActiveCollection, 
  bookNumber: string, 
  hadithNumber: string
): Promise<Hadith> => {
  try {
    // First check if it's in the cache
    const cachedHadith = cachedHadiths.find(h => 
      h.collection === collection && 
      h.bookNumber === bookNumber && 
      h.hadithNumber === hadithNumber
    );
    
    if (cachedHadith) {
      return cachedHadith;
    }
    
    // If not in cache, fetch from API
    const hadith = await fetchHadithByNumber(collection, bookNumber, hadithNumber);
    
    // Add to cache
    cachedHadiths.push(hadith);
    
    return hadith;
  } catch (error) {
    console.error(`Failed to fetch hadith ${collection} ${bookNumber}:${hadithNumber}:`, error);
    
    // Try to find any hadith from the same book in cache
    const bookHadith = cachedHadiths.find(h => h.bookNumber === bookNumber);
    if (bookHadith) return bookHadith;
    
    // Last resort: return first cached hadith or throw error
    if (cachedHadiths.length > 0) {
      return cachedHadiths[0];
    }
    
    // If everything fails, return a placeholder hadith
    return {
      id: "0", // Ensure ID is a string
      collection: collection,
      bookNumber: bookNumber,
      chapterNumber: bookNumber,
      hadithNumber: hadithNumber,
      arabic: 'لا يوجد حديث',
      english: 'There was an error loading this hadith. Please try again later.',
      reference: `${collection} ${bookNumber}:${hadithNumber}`,
      grade: '',
      narrator: ''
    };
  }
};

// Get hadith index from collection, book, and hadith number
export const getHadithIndex = async (
  collection: string = currentActiveCollection, 
  bookNumber: string, 
  hadithNumber: string
): Promise<number> => {
  try {
    await loadHadithData();
    
    const index = cachedHadiths.findIndex(h => 
      h.collection === collection && 
      h.bookNumber === bookNumber && 
      h.hadithNumber === hadithNumber
    );
    
    return index >= 0 ? index : 0;
  } catch (error) {
    console.error("Error in getHadithIndex:", error);
    return 0;
  }
};

// Get the next hadith in sequence
export const getNextHadith = async (current: Hadith): Promise<Hadith> => {
  // First try to get the next hadith by querying the API for the next hadith number in the same book
  try {
    const nextHadithNumber = (parseInt(current.hadithNumber) + 1).toString();
    return await fetchHadith(current.collection, current.bookNumber, nextHadithNumber);
  } catch (error) {
    console.log("Could not get next hadith directly, trying next book...");
    
    // If that fails, try to get the first hadith of the next book
    try {
      const books = await getHadithChapters(current.collection);
      const currentBookIndex = books.findIndex(b => b.id === current.bookNumber);
      
      if (currentBookIndex >= 0 && currentBookIndex < books.length - 1) {
        const nextBook = books[currentBookIndex + 1];
        return await fetchHadith(current.collection, nextBook.id, "1");
      }
    } catch (innerError) {
      console.error("Failed to get next book hadith:", innerError);
    }
    
    // If all attempts fail, resort to index-based navigation with cached hadiths
    const currentIndex = cachedHadiths.findIndex(h => 
      h.collection === current.collection && 
      h.bookNumber === current.bookNumber && 
      h.hadithNumber === current.hadithNumber
    );
    
    if (currentIndex === -1 || currentIndex === cachedHadiths.length - 1) {
      return current;
    }
    
    return cachedHadiths[currentIndex + 1];
  }
};

// Get the previous hadith in sequence
export const getPreviousHadith = async (current: Hadith): Promise<Hadith> => {
  // First try to get the previous hadith by querying the API for the previous hadith number in the same book
  try {
    if (parseInt(current.hadithNumber) > 1) {
      const prevHadithNumber = (parseInt(current.hadithNumber) - 1).toString();
      return await fetchHadith(current.collection, current.bookNumber, prevHadithNumber);
    } else {
      throw new Error("At first hadith in book");
    }
  } catch (error) {
    console.log("Could not get previous hadith directly, trying previous book...");
    
    // If that fails, try to get the last hadith of the previous book
    try {
      const books = await getHadithChapters(current.collection);
      const currentBookIndex = books.findIndex(b => b.id === current.bookNumber);
      
      if (currentBookIndex > 0) {
        const prevBook = books[currentBookIndex - 1];
        // Ideally we'd get the last hadith of the previous book, but we'd need to know its count
        // For now, let's try a high number and let the API handle it
        const prevBookHadiths = await getHadithsByChapter(prevBook.id, current.collection);
        if (prevBookHadiths.length > 0) {
          return prevBookHadiths[prevBookHadiths.length - 1];
        }
      }
    } catch (innerError) {
      console.error("Failed to get previous book hadith:", innerError);
    }
    
    // If all attempts fail, resort to index-based navigation with cached hadiths
    const currentIndex = cachedHadiths.findIndex(h => 
      h.collection === current.collection && 
      h.bookNumber === current.bookNumber && 
      h.hadithNumber === current.hadithNumber
    );
    
    if (currentIndex <= 0) {
      return current;
    }
    
    return cachedHadiths[currentIndex - 1];
  }
};

// Function to search hadiths
export const searchHadith = async (query: string): Promise<Hadith[]> => {
  if (!query.trim()) return [];
  
  try {
    // First try to use the external API
    const apiResults = await searchHadithsInThe9Books(query);
    
    // If API search returns results, use them
    if (apiResults && apiResults.length > 0) {
      console.log(`Found ${apiResults.length} results from API search for "${query}"`);
      return apiResults;
    }
    
    // If API search fails or returns no results, use the enhanced local search
    console.log(`No results from API, falling back to enhanced local search for "${query}"`);
    
    // Ensure data is loaded
    await loadHadithData();
    
    if (cachedHadiths.length > 0) {
      // Convert the query to searchable format
      const queryLower = query.toLowerCase().trim();
      
      // Split into keywords for better matching
      const keywords = queryLower
        .split(/\s+|[.,;:!?()]/)
        .filter(keyword => keyword.length > 0);
      
      // Score-based ranking for better results
      const scoredResults = cachedHadiths.map(hadith => {
        const textToSearch = (
          (hadith.english || '').toLowerCase() + ' ' +
          (hadith.narrator || '').toLowerCase()
        );
        
        let score = 0;
        
        // Exact phrase match (highest priority)
        if (textToSearch.includes(queryLower)) {
          score += 100;
        }
        
        // Individual keyword matches
        for (const keyword of keywords) {
          if (keyword.length <= 2) continue; // Skip very short keywords
          
          // Word boundary match
          const wordBoundaryRegex = new RegExp(`\\b${keyword}\\b`, 'i');
          if (wordBoundaryRegex.test(textToSearch)) {
            score += 50;
          } 
          // Substring match
          else if (textToSearch.includes(keyword)) {
            score += 20;
          }
        }
        
        // Calculate match ratio for keywords
        const keywordMatchCount = keywords.filter(kw => 
          kw.length > 2 && textToSearch.includes(kw)
        ).length;
        
        if (keywords.length > 0) {
          const keywordMatchRatio = keywordMatchCount / keywords.length;
          score += keywordMatchRatio * 40;
        }
        
        return { hadith, score };
      });
      
      // Filter and sort by score
      const filteredResults = scoredResults
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score);
      
      return filteredResults.map(result => result.hadith);
    }
    
    return [];
  } catch (error) {
    console.error("Search error:", error);
    
    // Ultimate fallback to very simple search if everything else fails
    if (cachedHadiths.length > 0) {
      const searchTerms = query.toLowerCase().split(' ');
      
      return cachedHadiths.filter(hadith => {
        const englishText = hadith.english.toLowerCase();
        return searchTerms.some(term => englishText.includes(term));
      });
    }
    
    return [];
  }
};

// Function to get a random hadith
export const getRandomHadith = async (): Promise<Hadith> => {
  try {
    await loadHadithData();
    
    if (cachedHadiths.length === 0) {
      throw new Error("No hadiths loaded");
    }
    
    const randomIndex = Math.floor(Math.random() * cachedHadiths.length);
    return cachedHadiths[randomIndex];
  } catch (error) {
    console.error("Error in getRandomHadith:", error);
    // Return a placeholder hadith
    return {
      id: "0",  // Convert to string to match type
      collection: currentActiveCollection,
      bookNumber: "1",
      chapterNumber: "1",
      hadithNumber: "1",
      arabic: 'عَنْ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ قَالَ سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
      english: 'Actions are judged by intentions.',
      reference: `${currentActiveCollection} 1:1`,
      grade: 'Sahih',
      narrator: 'Umar ibn Al-Khattab'
    };
  }
};

// Load on module initialization
loadHadithData().catch(console.error);
