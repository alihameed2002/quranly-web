// Hadith data fetching utilities for offline caching

import { getOfflineData } from '@/utils/offlineStorage';

// API base URL
const API_BASE_URL = 'https://api.sunnah.com/v1';

// Main collections to cache
const COLLECTIONS_TO_CACHE = ['bukhari', 'muslim', 'nasai', 'abudawud', 'tirmidhi', 'ibnmajah'];

// Types
interface HadithCollection {
  id: string;
  name: string;
  englishName: string;
  hasBooks: boolean;
  hasChapters: boolean;
  totalHadith: number;
}

interface HadithBook {
  bookNumber: string;
  bookName: string;
  numberOfHadith: number;
}

interface HadithChapter {
  chapterId: string;
  chapterNumber: string;
  chapterTitle: string;
  chapterTitleArabic: string;
  babNumber: string;
  babName: string;
}

interface Hadith {
  collection: string;
  bookNumber: string;
  chapterId?: string;
  hadithNumber: string;
  text: string;
  textArabic?: string;
  grading?: string;
}

// Check if the device is online
function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

// Fetch all hadith collections metadata
export async function fetchHadithCollections(): Promise<{
  collections: HadithCollection[];
  data: Record<string, any>;
}> {
  try {
    // Always try to get data from offline storage first
    const offlineData = await getOfflineData('hadith', 'collections').catch(() => null);
    
    // Get any collection data that might be available offline
    const offlineCollectionData: Record<string, any> = {};
    
    if (offlineData) {
      console.log('Using cached hadith collections from IndexedDB');
      
      // Try to get any collection data that might be cached
      for (const collection of offlineData) {
        try {
          const collectionData = await getOfflineData('hadith', `collection-${collection.id}`).catch(() => null);
          if (collectionData) {
            offlineCollectionData[collection.id] = collectionData;
          }
        } catch (err) {
          console.error(`Error getting offline data for collection ${collection.id}:`, err);
        }
      }
      
      // If we're offline and have collections data, return it without trying the network
      if (!isOnline() && offlineData.length > 0) {
        return {
          collections: offlineData,
          data: offlineCollectionData
        };
      }
    }
    
    // If not available offline or we're online, try fetching from API
    if (isOnline()) {
      try {
        console.log('Fetching hadith collections from API');
        const response = await fetch(`${API_BASE_URL}/collections`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch hadith collections: ${response.statusText}`);
        }
        
        const data = await response.json();
        const collections = data.data.map((collection: any) => ({
          id: collection.name,
          name: collection.title,
          englishName: collection.title,
          hasBooks: true,
          hasChapters: collection.hasChapters,
          totalHadith: collection.totalHadith || 0
        }));
        
        // Filter to only include main collections we want to cache
        const filteredCollections = collections.filter(
          (collection: HadithCollection) => COLLECTIONS_TO_CACHE.includes(collection.id)
        );
        
        // Fetch each collection's data for offline caching
        const collectionData: Record<string, any> = {};
        
        await Promise.all(
          filteredCollections.map(async (collection: HadithCollection) => {
            const collectionId = collection.id;
            
            // Check if we already have this collection data offline
            const existingCollectionData = await getOfflineData('hadith', `collection-${collectionId}`).catch(() => null);
            if (existingCollectionData) {
              collectionData[collectionId] = existingCollectionData;
              return;
            }
            
            try {
              const booksResponse = await fetch(`${API_BASE_URL}/collections/${collectionId}/books`, {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              });
              
              if (!booksResponse.ok) {
                throw new Error(`Failed to fetch books for ${collectionId}: ${booksResponse.statusText}`);
              }
              
              const booksData = await booksResponse.json();
              const books = booksData.data;
              
              // For each book, fetch a sample of hadiths (first 10)
              const bookSamples = await Promise.all(
                books.slice(0, 5).map(async (book: any) => {
                  const hadithResponse = await fetch(
                    `${API_BASE_URL}/collections/${collectionId}/books/${book.bookNumber}/hadiths?limit=10&page=1`,
                    {
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      }
                    }
                  );
                  
                  if (!hadithResponse.ok) {
                    throw new Error(`Failed to fetch hadiths for ${collectionId} book ${book.bookNumber}: ${hadithResponse.statusText}`);
                  }
                  
                  const hadithData = await hadithResponse.json();
                  return {
                    bookNumber: book.bookNumber,
                    hadiths: hadithData.data.map((h: any) => ({
                      collection: collectionId,
                      bookNumber: book.bookNumber,
                      hadithNumber: h.hadithNumber,
                      text: h.text,
                      textArabic: h.arabicText,
                      grading: h.grade
                    }))
                  };
                })
              );
              
              collectionData[collectionId] = {
                books,
                bookSamples
              };
            } catch (error) {
              console.error(`Error fetching data for collection ${collectionId}:`, error);
              // Skip this collection and continue with others
            }
          })
        );
        
        return {
          collections: filteredCollections,
          data: collectionData
        };
      } catch (networkError) {
        console.error('Network error fetching hadith collections:', networkError);
        // Fall back to offline data if available
        if (offlineData && offlineData.length > 0) {
          console.log('Falling back to cached hadith collections');
          return {
            collections: offlineData,
            data: offlineCollectionData
          };
        }
        throw networkError;
      }
    }
    
    // If we're offline and have offline data, return it
    if (offlineData && offlineData.length > 0) {
      console.log('Using cached hadith collections (offline)');
      return {
        collections: offlineData,
        data: offlineCollectionData
      };
    }
    
    // If we reach here, we're offline with no data
    throw new Error('Unable to fetch hadith collections: offline with no cached data');
  } catch (error) {
    console.error('Error fetching hadith collections:', error);
    
    // Last resort fallback - return empty collections if nothing else worked
    return {
      collections: [],
      data: {}
    };
  }
}

// Get a specific hadith collection
export async function getHadithCollection(collectionId: string): Promise<any> {
  try {
    // Always try to get from offline storage first
    const offlineData = await getOfflineData('hadith', `collection-${collectionId}`).catch(() => null);
    
    // If we have offline data and we're offline, use it immediately
    if (offlineData && !isOnline()) {
      console.log(`Using cached hadith collection: ${collectionId} (offline)`);
      return offlineData;
    }
    
    // If we're online, try to fetch from API
    if (isOnline()) {
      try {
        // Implement API fetching for a specific collection
        // This is similar to what we do in fetchHadithCollections but for a single collection
        
        console.log(`Fetching hadith collection from API: ${collectionId}`);
        
        const booksResponse = await fetch(`${API_BASE_URL}/collections/${collectionId}/books`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!booksResponse.ok) {
          throw new Error(`Failed to fetch books for ${collectionId}: ${booksResponse.statusText}`);
        }
        
        const booksData = await booksResponse.json();
        const books = booksData.data;
        
        // For each book, fetch a sample of hadiths (first 10)
        const bookSamples = await Promise.all(
          books.slice(0, 5).map(async (book: any) => {
            const hadithResponse = await fetch(
              `${API_BASE_URL}/collections/${collectionId}/books/${book.bookNumber}/hadiths?limit=10&page=1`,
              {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              }
            );
            
            if (!hadithResponse.ok) {
              throw new Error(`Failed to fetch hadiths for ${collectionId} book ${book.bookNumber}: ${hadithResponse.statusText}`);
            }
            
            const hadithData = await hadithResponse.json();
            return {
              bookNumber: book.bookNumber,
              hadiths: hadithData.data.map((h: any) => ({
                collection: collectionId,
                bookNumber: book.bookNumber,
                hadithNumber: h.hadithNumber,
                text: h.text,
                textArabic: h.arabicText,
                grading: h.grade
              }))
            };
          })
        );
        
        const collectionData = {
          books,
          bookSamples
        };
        
        return collectionData;
      } catch (networkError) {
        console.error(`Network error fetching hadith collection ${collectionId}:`, networkError);
        
        // Fall back to offline data if available
        if (offlineData) {
          console.log(`Falling back to cached hadith collection: ${collectionId}`);
          return offlineData;
        }
        
        throw networkError;
      }
    }
    
    // If we reach here, we're offline but have offline data
    if (offlineData) {
      console.log(`Using cached hadith collection: ${collectionId} (offline)`);
      return offlineData;
    }
    
    // If we reach here, we're offline with no data
    throw new Error(`Hadith collection ${collectionId} not available offline`);
  } catch (error) {
    console.error(`Error getting hadith collection ${collectionId}:`, error);
    // Return empty collection as last resort
    return {
      books: [],
      bookSamples: []
    };
  }
} 