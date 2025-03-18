
import { Hadith } from './hadithTypes';

// Configuration for The9Books API
interface The9BooksConfig {
  baseUrl: string;
  collections: {
    [key: string]: {
      id: string;
      name: string;
      booksCount: number;
    }
  }
}

// The9Books API configuration with actual endpoints
export const the9BooksConfig: The9BooksConfig = {
  baseUrl: 'https://api.the9books.com/v1',
  collections: {
    bukhari: {
      id: 'bukhari',
      name: 'Sahih Bukhari',
      booksCount: 97
    },
    muslim: {
      id: 'muslim',
      name: 'Sahih Muslim',
      booksCount: 56
    },
    abudawud: {
      id: 'abudawud',
      name: 'Sunan Abu Dawud',
      booksCount: 43
    },
    tirmidhi: {
      id: 'tirmidhi',
      name: 'Jami at-Tirmidhi',
      booksCount: 49
    },
    nasai: {
      id: 'nasai',
      name: 'Sunan an-Nasa\'i',
      booksCount: 52
    },
    ibnmajah: {
      id: 'ibnmajah',
      name: 'Sunan Ibn Majah',
      booksCount: 37
    },
    malik: {
      id: 'malik',
      name: 'Muwatta Malik',
      booksCount: 61
    },
    ahmad: {
      id: 'ahmad',
      name: 'Musnad Ahmad',
      booksCount: 40
    },
    darimi: {
      id: 'darimi',
      name: 'Sunan al-Darimi',
      booksCount: 24
    }
  }
};

// Function to handle API errors
const handleApiError = (response: Response) => {
  if (!response.ok) {
    throw new Error(`The9Books API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Fetch all collections from The9Books API
export const fetchCollections = async (): Promise<{ id: string, name: string }[]> => {
  try {
    const response = await fetch(`${the9BooksConfig.baseUrl}/collections`);
    const data = await handleApiError(response);
    
    return data.collections.map((collection: any) => ({
      id: collection.id,
      name: collection.name
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    // Fallback to the local configuration if API fails
    return Object.values(the9BooksConfig.collections).map(collection => ({
      id: collection.id,
      name: collection.name
    }));
  }
};

// Fetch books/chapters for a specific collection
export const fetchBooks = async (collectionId: string): Promise<{ id: number, name: string, hadithCount: number }[]> => {
  try {
    const response = await fetch(`${the9BooksConfig.baseUrl}/collections/${collectionId}/books`);
    const data = await handleApiError(response);
    
    return data.books.map((book: any) => ({
      id: book.number,
      name: book.name.english || `Book ${book.number}`,
      hadithCount: book.hadiths_count
    }));
  } catch (error) {
    console.error(`Error fetching books for collection ${collectionId}:`, error);
    throw error;
  }
};

// Fetch hadiths for a specific book in a collection
export const fetchHadithsByBook = async (
  collectionId: string, 
  bookId: number,
  page: number = 1,
  limit: number = 50
): Promise<Hadith[]> => {
  try {
    const response = await fetch(
      `${the9BooksConfig.baseUrl}/collections/${collectionId}/books/${bookId}/hadiths?page=${page}&limit=${limit}`
    );
    const data = await handleApiError(response);
    
    return data.hadiths.map((hadith: any) => convertApiHadithToAppHadith(hadith));
  } catch (error) {
    console.error(`Error fetching hadiths for collection ${collectionId}, book ${bookId}:`, error);
    throw error;
  }
};

// Fetch a specific hadith by number
export const fetchHadithByNumber = async (
  collectionId: string,
  bookId: number,
  hadithNumber: number
): Promise<Hadith> => {
  try {
    const response = await fetch(
      `${the9BooksConfig.baseUrl}/collections/${collectionId}/books/${bookId}/hadiths/${hadithNumber}`
    );
    const data = await handleApiError(response);
    
    return convertApiHadithToAppHadith(data.hadith);
  } catch (error) {
    console.error(`Error fetching hadith ${hadithNumber} from collection ${collectionId}, book ${bookId}:`, error);
    throw error;
  }
};

// Search hadiths across collections or within a specific collection
export const searchHadithsInThe9Books = async (
  query: string,
  collectionId?: string,
  page: number = 1,
  limit: number = 50
): Promise<Hadith[]> => {
  try {
    let url = `${the9BooksConfig.baseUrl}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
    
    if (collectionId) {
      url += `&collection=${collectionId}`;
    }
    
    const response = await fetch(url);
    const data = await handleApiError(response);
    
    return data.hadiths.map((hadith: any) => convertApiHadithToAppHadith(hadith));
  } catch (error) {
    console.error(`Error searching hadiths for "${query}":`, error);
    throw error;
  }
};

// Convert The9Books API data format to our app's Hadith type
export const convertApiHadithToAppHadith = (apiHadith: any): Hadith => {
  return {
    id: apiHadith.id || 0,
    collection: apiHadith.collection_name || '',
    bookNumber: apiHadith.book_number || 0,
    chapterNumber: apiHadith.chapter_number || apiHadith.book_number || 0,
    hadithNumber: apiHadith.hadith_number || 0,
    arabic: apiHadith.text.arabic || '',
    english: apiHadith.text.english || '',
    reference: `${apiHadith.collection_name} ${apiHadith.book_number}:${apiHadith.hadith_number}`,
    grade: apiHadith.grade || '',
    narrator: apiHadith.narrator || ''
  };
};
