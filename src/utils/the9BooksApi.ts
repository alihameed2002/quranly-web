
import { Hadith } from './hadithTypes';

interface Book {
  id: string;
  name: string;
  hadithCount: number;
}

// In a real-world implementation, this would be an API call to a hadith API
// For now, we'll use mock data
export const fetchBooks = async (collection: string): Promise<Book[]> => {
  console.log(`Fetching books for collection: ${collection}`);
  
  // Mock data for bukhari collection
  if (collection === 'bukhari') {
    return [
      { id: "1", name: "Revelation (Wahy)", hadithCount: 7 },
      { id: "2", name: "Belief (Iman)", hadithCount: 50 },
      { id: "3", name: "Knowledge (Ilm)", hadithCount: 75 },
      { id: "4", name: "Ablution (Wudu)", hadithCount: 112 },
      { id: "5", name: "Bathing (Ghusl)", hadithCount: 45 }
    ];
  }
  
  // Default mock data for other collections
  return [
    { id: "1", name: "Book 1", hadithCount: 50 },
    { id: "2", name: "Book 2", hadithCount: 60 },
    { id: "3", name: "Book 3", hadithCount: 40 }
  ];
};

// Fetch hadiths by book
export const fetchHadithsByBook = async (collection: string, bookId: string): Promise<Hadith[]> => {
  console.log(`Fetching hadiths for collection: ${collection}, book: ${bookId}`);
  
  // Generate mock data
  const count = 10; // Mock 10 hadiths per book
  
  const hadiths: Hadith[] = [];
  
  for (let i = 1; i <= count; i++) {
    hadiths.push({
      id: i,
      collection: collection,
      bookNumber: bookId,
      chapterNumber: bookId,
      hadithNumber: i.toString(),
      arabic: `نص الحديث العربي رقم ${i} من الكتاب ${bookId}`,
      english: `This is hadith number ${i} from book ${bookId} of ${collection}.`,
      reference: `${collection.charAt(0).toUpperCase() + collection.slice(1)} ${bookId}:${i}`,
      grade: "Sahih",
      narrator: "Abu Hurairah"
    });
  }
  
  return hadiths;
};

// Fetch a specific hadith by number
export const fetchHadithByNumber = async (
  collection: string, 
  bookId: string, 
  hadithNumber: string
): Promise<Hadith> => {
  console.log(`Fetching hadith by number: collection=${collection}, book=${bookId}, hadith=${hadithNumber}`);
  
  // Mock a specific hadith
  return {
    id: parseInt(hadithNumber), 
    collection: collection,
    bookNumber: bookId,
    chapterNumber: bookId,
    hadithNumber: hadithNumber,
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    english: `This is hadith number ${hadithNumber} from book ${bookId} of ${collection}.`,
    reference: `${collection.charAt(0).toUpperCase() + collection.slice(1)} ${bookId}:${hadithNumber}`,
    grade: "Sahih",
    narrator: "Abu Hurairah"
  };
};

// Search for hadiths across The 9 Books
export const searchHadithsInThe9Books = async (query: string): Promise<Hadith[]> => {
  console.log(`Searching for hadiths containing: ${query}`);
  
  // Mock search results
  const results: Hadith[] = [];
  
  for (let i = 1; i <= 5; i++) {
    results.push({
      id: i,
      collection: 'bukhari',
      bookNumber: i.toString(),
      chapterNumber: i.toString(),
      hadithNumber: i.toString(),
      arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
      english: `This is a search result for "${query}". Hadith number ${i}.`,
      reference: `Bukhari ${i}:${i}`,
      grade: "Sahih",
      narrator: "Abu Hurairah"
    });
  }
  
  return results;
};
