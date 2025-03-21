// Utility for managing offline data storage with IndexedDB

// Database configuration
const DB_NAME = 'quranly-offline-db';
const DB_VERSION = 1;
const STORES = {
  QURAN: 'quran',
  HADITH: 'hadith',
  META: 'meta'
};

// Opens a connection to the IndexedDB database
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open offline database'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.QURAN)) {
        db.createObjectStore(STORES.QURAN, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.HADITH)) {
        db.createObjectStore(STORES.HADITH, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.META)) {
        db.createObjectStore(STORES.META, { keyPath: 'key' });
      }
    };
  });
}

// Check if offline data is available
export async function checkOfflineDataAvailability(): Promise<boolean> {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORES.META, 'readonly');
    const store = transaction.objectStore(STORES.META);
    
    return new Promise((resolve) => {
      const request = store.get('offlineDataComplete');
      
      request.onsuccess = () => {
        resolve(!!request.result?.value);
      };
      
      request.onerror = () => {
        resolve(false);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error checking offline data:', error);
    return false;
  }
}

// Store offline data
export async function storeOfflineData(data: { quran: any; hadith: any }): Promise<void> {
  try {
    const db = await openDatabase();
    
    // Store Quran data
    if (data.quran) {
      const quranTransaction = db.transaction(STORES.QURAN, 'readwrite');
      const quranStore = quranTransaction.objectStore(STORES.QURAN);
      
      // Clear existing data
      quranStore.clear();
      
      // Store surahs
      if (Array.isArray(data.quran.surahs)) {
        quranStore.put({ id: 'surah-list', type: 'surah-list', data: data.quran.surahs });
        
        data.quran.surahs.forEach((surah: any) => {
          quranStore.put({ id: `surah-${surah.number}`, type: 'surah', data: surah });
        });
      }
      
      // Store verses by surah
      if (data.quran.verses) {
        Object.entries(data.quran.verses).forEach(([surahId, verses]) => {
          quranStore.put({ id: `verses-${surahId}`, type: 'verses', data: verses });
        });
      }
      
      // Store translations or other data
      if (data.quran.translations) {
        Object.entries(data.quran.translations).forEach(([key, value]) => {
          quranStore.put({ id: `translation-${key}`, type: 'translation', data: value });
        });
      }
    }
    
    // Store Hadith data
    if (data.hadith) {
      const hadithTransaction = db.transaction(STORES.HADITH, 'readwrite');
      const hadithStore = hadithTransaction.objectStore(STORES.HADITH);
      
      // Clear existing data
      hadithStore.clear();
      
      // Store collections metadata
      if (Array.isArray(data.hadith.collections)) {
        hadithStore.put({ id: 'collections', type: 'metadata', data: data.hadith.collections });
      }
      
      // Store individual collections
      if (data.hadith.data) {
        Object.entries(data.hadith.data).forEach(([collectionId, content]) => {
          hadithStore.put({ id: `collection-${collectionId}`, type: 'collection', data: content });
        });
      }
    }
    
    // Mark data as complete
    const metaTransaction = db.transaction(STORES.META, 'readwrite');
    const metaStore = metaTransaction.objectStore(STORES.META);
    metaStore.put({ key: 'offlineDataComplete', value: true, timestamp: Date.now() });
    
    // Close the database when all transactions complete
    return new Promise((resolve, reject) => {
      metaTransaction.oncomplete = () => {
        db.close();
        resolve();
      };
      
      metaTransaction.onerror = () => {
        reject(new Error('Failed to store offline data'));
      };
    });
  } catch (error) {
    console.error('Error storing offline data:', error);
    throw new Error('Failed to store offline data');
  }
}

// Retrieve offline data
export async function getOfflineData(type: 'quran' | 'hadith', id?: string): Promise<any> {
  try {
    const db = await openDatabase();
    const storeName = type === 'quran' ? STORES.QURAN : STORES.HADITH;
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      if (id) {
        // Retrieve specific item
        const request = store.get(id);
        
        request.onsuccess = () => {
          resolve(request.result?.data || null);
        };
        
        request.onerror = () => {
          reject(new Error(`Failed to retrieve ${type} data with id ${id}`));
        };
      } else {
        // Retrieve all items of this type
        const results: any[] = [];
        const request = store.openCursor();
        
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            results.push(cursor.value);
            cursor.continue();
          }
        };
        
        transaction.oncomplete = () => {
          db.close();
          resolve(results);
        };
        
        request.onerror = () => {
          reject(new Error(`Failed to retrieve ${type} data`));
        };
      }
    });
  } catch (error) {
    console.error(`Error retrieving ${type} data:`, error);
    throw new Error(`Failed to retrieve ${type} data`);
  }
}

// Clear all offline data
export async function clearOfflineData(): Promise<void> {
  try {
    const db = await openDatabase();
    const storeNames = [STORES.QURAN, STORES.HADITH, STORES.META];
    
    // Create and execute transactions for each store
    const clearPromises = storeNames.map(storeName => {
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error(`Failed to clear ${storeName} store`));
      });
    });
    
    await Promise.all(clearPromises);
    db.close();
  } catch (error) {
    console.error('Error clearing offline data:', error);
    throw new Error('Failed to clear offline data');
  }
} 