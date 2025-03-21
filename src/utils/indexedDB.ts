import { Hadith } from './hadithTypes';
import { Verse } from './quranTypes';
import { toast } from "@/components/ui/use-toast";

// Database configuration
const DB_NAME = 'quranlyOfflineDB';
const DB_VERSION = 1;
const STORES = {
  HADITHS: 'hadiths',
  VERSES: 'verses',
  COLLECTIONS: 'collections',
  SURAHS: 'surahs',
  CONFIG: 'config',
};

// Utils for interacting with IndexedDB for verse storage

// Function to clean up verse translation text
function cleanVerseTranslation(text: string): string {
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

// Open database connection
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      toast({
        title: "Error",
        description: "Failed to open offline database. Some features may not work offline.",
        variant: "destructive",
      });
      reject('Failed to open database');
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.HADITHS)) {
        const hadithStore = db.createObjectStore(STORES.HADITHS, { keyPath: 'id' });
        hadithStore.createIndex('collection', 'collection', { unique: false });
        hadithStore.createIndex('bookNumber', 'bookNumber', { unique: false });
        hadithStore.createIndex('hadithNumber', 'hadithNumber', { unique: false });
        hadithStore.createIndex('collectionBook', ['collection', 'bookNumber'], { unique: false });
      }
      
      if (!db.objectStoreNames.contains(STORES.VERSES)) {
        const verseStore = db.createObjectStore(STORES.VERSES, { keyPath: 'id' });
        verseStore.createIndex('surah', 'surah', { unique: false });
        verseStore.createIndex('ayah', 'ayah', { unique: false });
        verseStore.createIndex('surahAyah', ['surah', 'ayah'], { unique: true });
      }
      
      if (!db.objectStoreNames.contains(STORES.COLLECTIONS)) {
        db.createObjectStore(STORES.COLLECTIONS, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.SURAHS)) {
        db.createObjectStore(STORES.SURAHS, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.CONFIG)) {
        db.createObjectStore(STORES.CONFIG, { keyPath: 'key' });
      }
    };
  });
};

// Save hadiths to IndexedDB
export const saveHadiths = async (hadiths: Hadith[]): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORES.HADITHS, 'readwrite');
    const store = transaction.objectStore(STORES.HADITHS);

    // Add each hadith to the store
    for (const hadith of hadiths) {
      store.put(hadith);
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log(`Saved ${hadiths.length} hadiths to IndexedDB`);
        resolve();
      };
      
      transaction.onerror = (event) => {
        console.error('Error saving hadiths:', event);
        reject('Failed to save hadiths');
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    throw error;
  }
};

// Get all hadiths for a specific collection
export const getHadithsByCollection = async (collectionId: string): Promise<Hadith[]> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORES.HADITHS, 'readonly');
    const store = transaction.objectStore(STORES.HADITHS);
    const index = store.index('collection');
    const request = index.getAll(collectionId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const hadiths = request.result;
        console.log(`Retrieved ${hadiths.length} hadiths for collection ${collectionId} from IndexedDB`);
        resolve(hadiths);
      };
      
      request.onerror = (event) => {
        console.error('Error retrieving hadiths:', event);
        reject('Failed to retrieve hadiths');
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    return [];
  }
};

// Get hadiths by book
export const getHadithsByBook = async (collectionId: string, bookNumber: string): Promise<Hadith[]> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORES.HADITHS, 'readonly');
    const store = transaction.objectStore(STORES.HADITHS);
    const index = store.index('collectionBook');
    const request = index.getAll([collectionId, bookNumber]);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        console.error('Error retrieving hadiths by book:', event);
        reject('Failed to retrieve hadiths by book');
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    return [];
  }
};

// Get a specific hadith
export const getHadith = async (collectionId: string, bookNumber: string, hadithNumber: string): Promise<Hadith | null> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORES.HADITHS, 'readonly');
    const store = transaction.objectStore(STORES.HADITHS);
    const request = store.openCursor();
    
    return new Promise((resolve, reject) => {
      const results: Hadith[] = [];
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        
        if (cursor) {
          const hadith = cursor.value;
          if (
            hadith.collection === collectionId && 
            hadith.bookNumber === bookNumber && 
            hadith.hadithNumber === hadithNumber
          ) {
            results.push(hadith);
          }
          cursor.continue();
        } else {
          // Done iterating
          resolve(results.length > 0 ? results[0] : null);
        }
      };
      
      request.onerror = (event) => {
        console.error('Error retrieving hadith:', event);
        reject('Failed to retrieve hadith');
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    return null;
  }
};

// Get all verses for a specific surah
export const getVersesBySurah = async (surahId: number): Promise<Verse[]> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORES.VERSES, 'readonly');
    const store = transaction.objectStore(STORES.VERSES);
    const index = store.index('surah');
    const request = index.getAll(surahId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const verses = request.result;
        // Clean up translations to remove unwanted HTML and footnotes
        const cleanedVerses = verses.map(verse => ({
          ...verse,
          translation: cleanVerseTranslation(verse.translation)
        }));
        console.log(`Retrieved ${verses.length} verses for surah ${surahId} from IndexedDB`);
        resolve(cleanedVerses);
      };
      
      request.onerror = (event) => {
        console.error('Error retrieving verses:', event);
        reject('Failed to retrieve verses');
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    return [];
  }
};

// Get a specific verse
export const getVerse = async (surahId: number, ayahId: number): Promise<Verse | null> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORES.VERSES, 'readonly');
    const store = transaction.objectStore(STORES.VERSES);
    const index = store.index('surahAyah');
    const request = index.get([surahId, ayahId]);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const verse = request.result;
        if (verse) {
          // Clean up translation to remove unwanted HTML and footnotes
          verse.translation = cleanVerseTranslation(verse.translation);
        }
        resolve(verse || null);
      };
      
      request.onerror = (event) => {
        console.error('Error retrieving verse:', event);
        reject('Failed to retrieve verse');
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    return null;
  }
};

// Save verses to IndexedDB
export const saveVerses = async (verses: Verse[]): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORES.VERSES, 'readwrite');
    const store = transaction.objectStore(STORES.VERSES);

    // Add each verse to the store with cleaned translations
    for (const verse of verses) {
      const cleanedVerse = {
        ...verse,
        translation: cleanVerseTranslation(verse.translation)
      };
      store.put(cleanedVerse);
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log(`Saved ${verses.length} verses to IndexedDB`);
        resolve();
      };
      
      transaction.onerror = (event) => {
        console.error('Error saving verses:', event);
        reject('Failed to save verses');
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    throw error;
  }
};

// Get all verses (for search)
export const getAllVerses = async (): Promise<Verse[]> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORES.VERSES, 'readonly');
    const store = transaction.objectStore(STORES.VERSES);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const verses = request.result;
        console.log(`Retrieved ${verses.length} verses from IndexedDB`);
        resolve(verses);
      };
      
      request.onerror = (event) => {
        console.error('Error retrieving all verses:', event);
        reject('Failed to retrieve all verses');
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    return [];
  }
};

// Save collection data
export const saveCollectionData = async (collectionId: string, data: any): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORES.COLLECTIONS, 'readwrite');
    const store = transaction.objectStore(STORES.COLLECTIONS);
    
    store.put({
      id: collectionId,
      data: data,
      timestamp: Date.now()
    });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log(`Saved collection data for ${collectionId} to IndexedDB`);
        resolve();
      };
      
      transaction.onerror = (event) => {
        console.error('Error saving collection data:', event);
        reject('Failed to save collection data');
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    throw error;
  }
};

// Get collection data
export const getCollectionData = async (collectionId: string): Promise<any | null> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORES.COLLECTIONS, 'readonly');
    const store = transaction.objectStore(STORES.COLLECTIONS);
    const request = store.get(collectionId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        if (request.result) {
          console.log(`Retrieved collection data for ${collectionId} from IndexedDB`);
          resolve(request.result.data);
        } else {
          console.log(`No collection data for ${collectionId} in IndexedDB`);
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        console.error('Error retrieving collection data:', event);
        reject('Failed to retrieve collection data');
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    return null;
  }
};

// Save surah data
export const saveSurahData = async (surahs: any[]): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORES.SURAHS, 'readwrite');
    const store = transaction.objectStore(STORES.SURAHS);

    // Add each surah to the store
    for (const surah of surahs) {
      store.put({
        ...surah,
        timestamp: Date.now()
      });
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log(`Saved ${surahs.length} surahs to IndexedDB`);
        resolve();
      };
      
      transaction.onerror = (event) => {
        console.error('Error saving surahs:', event);
        reject('Failed to save surahs');
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    throw error;
  }
};

// Get all surahs
export const getAllSurahs = async (): Promise<any[]> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORES.SURAHS, 'readonly');
    const store = transaction.objectStore(STORES.SURAHS);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const surahs = request.result;
        console.log(`Retrieved ${surahs.length} surahs from IndexedDB`);
        // Sort surahs by ID
        surahs.sort((a, b) => a.id - b.id);
        resolve(surahs);
      };
      
      request.onerror = (event) => {
        console.error('Error retrieving surahs:', event);
        reject('Failed to retrieve surahs');
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    return [];
  }
};

// Save manifest data
export const saveManifest = async (manifest: any): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORES.CONFIG, 'readwrite');
    const store = transaction.objectStore(STORES.CONFIG);
    
    store.put({
      key: 'manifest',
      value: manifest,
      timestamp: Date.now()
    });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log('Saved manifest to IndexedDB');
        resolve();
      };
      
      transaction.onerror = (event) => {
        console.error('Error saving manifest:', event);
        reject('Failed to save manifest');
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    throw error;
  }
};

// Get manifest data
export const getManifest = async (): Promise<any | null> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORES.CONFIG, 'readonly');
    const store = transaction.objectStore(STORES.CONFIG);
    const request = store.get('manifest');

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        if (request.result) {
          console.log('Retrieved manifest from IndexedDB');
          resolve(request.result.value);
        } else {
          console.log('No manifest in IndexedDB');
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        console.error('Error retrieving manifest:', event);
        reject('Failed to retrieve manifest');
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    return null;
  }
};

// Check if database exists and contains data
export const isOfflineDataAvailable = async (): Promise<boolean> => {
  try {
    // Check if IndexedDB is supported
    if (!window.indexedDB) {
      console.log('IndexedDB not supported');
      return false;
    }
    
    // Try to open the database
    const db = await openDB();
    const transaction = db.transaction(STORES.CONFIG, 'readonly');
    const store = transaction.objectStore(STORES.CONFIG);
    const request = store.get('dataStatus');

    return new Promise((resolve) => {
      request.onsuccess = () => {
        if (request.result && request.result.value === 'complete') {
          console.log('Offline data is available');
          resolve(true);
        } else {
          console.log('Offline data is not available or incomplete');
          resolve(false);
        }
      };
      
      request.onerror = () => {
        console.log('Error checking offline data status');
        resolve(false);
      };
    });
  } catch (error) {
    console.error('Error checking offline data availability:', error);
    return false;
  }
};

// Set data status to complete
export const setOfflineDataComplete = async (): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORES.CONFIG, 'readwrite');
    const store = transaction.objectStore(STORES.CONFIG);
    
    store.put({
      key: 'dataStatus',
      value: 'complete',
      timestamp: Date.now()
    });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log('Offline data status set to complete');
        resolve();
      };
      
      transaction.onerror = (event) => {
        console.error('Error setting offline data status:', event);
        reject('Failed to set offline data status');
      };
    });
  } catch (error) {
    console.error('IndexedDB error:', error);
    throw error;
  }
}; 