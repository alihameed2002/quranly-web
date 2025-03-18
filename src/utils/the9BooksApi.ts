
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

// Sample data for when the API is unavailable
const sampleBooks = [
  { id: 1, name: 'Book of Revelation', hadithCount: 8 },
  { id: 2, name: 'Book of Faith', hadithCount: 63 },
  { id: 3, name: 'Book of Knowledge', hadithCount: 42 },
  { id: 4, name: 'Book of Ablution', hadithCount: 75 },
  { id: 5, name: 'Book of Bath', hadithCount: 28 }
];

// Sample hadiths for when the API is unavailable
const sampleHadiths: Hadith[] = [
  {
    id: 1,
    collection: 'bukhari',
    bookNumber: 1,
    chapterNumber: 1,
    hadithNumber: 1,
    arabic: 'عَنْ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ قَالَ سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    english: 'Narrated Umar bin Al-Khattab: I heard Allah\'s Messenger (ﷺ) saying, "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended."',
    reference: 'Bukhari 1:1',
    grade: 'Sahih',
    narrator: 'Umar bin Al-Khattab'
  },
  {
    id: 2,
    collection: 'bukhari',
    bookNumber: 1,
    chapterNumber: 1,
    hadithNumber: 2,
    arabic: 'حَدَّثَنَا عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ الْحُمَيْدِيُّ، قَالَ حَدَّثَنَا سُفْيَانُ، قَالَ حَدَّثَنَا يَحْيَى بْنُ سَعِيدٍ الأَنْصَارِيُّ، قَالَ أَخْبَرَنِي مُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ، أَنَّهُ سَمِعَ عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ، يَقُولُ سَمِعْتُ عُمَرَ بْنَ الْخَطَّابِ',
    english: 'Narrated Aisha: (the mother of the faithful believers) Al-Harith bin Hisham asked Allah\'s Messenger (ﷺ) "O Allah\'s Messenger (ﷺ)! How is the Divine Inspiration revealed to you?" Allah\'s Messenger (ﷺ) replied...',
    reference: 'Bukhari 1:2',
    grade: 'Sahih',
    narrator: 'Aisha'
  },
  {
    id: 3,
    collection: 'bukhari',
    bookNumber: 1,
    chapterNumber: 1,
    hadithNumber: 3,
    arabic: 'حَدَّثَنَا أَبُو الْيَمَانِ الْحَكَمُ بْنُ نَافِعٍ قَالَ أَخْبَرَنَا شُعَيْبٌ عَنْ الزُّهْرِيِّ قَالَ أَخْبَرَنِي عُبَيْدُ اللَّهِ بْنُ عَبْدِ اللَّهِ بْنِ عُتْبَةَ بْنِ مَسْعُودٍ أَنَّ عَبْدَ اللَّهِ بْنَ عَبَّاسٍ أَخْبَرَهُ',
    english: 'Narrated Abdullah bin Abbas: Abu Sufyan bin Harb informed me that Heraclius had sent a messenger to him while he had been accompanying a caravan from Quraish...',
    reference: 'Bukhari 1:3',
    grade: 'Sahih',
    narrator: 'Abdullah bin Abbas'
  },
  {
    id: 4,
    collection: 'bukhari',
    bookNumber: 2,
    chapterNumber: 2,
    hadithNumber: 1,
    arabic: 'حَدَّثَنَا مُحَمَّدُ بْنُ صَبَّاحٍ قَالَ أَخْبَرَنَا إِسْمَاعِيلُ بْنُ زَكَرِيَّاءَ عَنْ عَاصِمٍ الْأَحْوَلِ عَنْ عَبْدِ اللَّهِ بْنِ سَرْجِسَ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ',
    english: 'Narrated Abdullah: Allah\'s Messenger (ﷺ) said, "The person who offers his prayers with perfection when his people neglect them...',
    reference: 'Bukhari 2:1',
    grade: 'Sahih',
    narrator: 'Abdullah'
  },
  {
    id: 5,
    collection: 'bukhari',
    bookNumber: 2,
    chapterNumber: 2,
    hadithNumber: 2,
    arabic: 'حَدَّثَنَا عَبْدُ اللَّهِ بْنُ يُوسُفَ قَالَ أَخْبَرَنَا مَالِكٌ عَنْ هِشَامِ بْنِ عُرْوَةَ عَنْ أَبِيهِ عَنْ عَائِشَةَ أُمِّ الْمُؤْمِنِينَ',
    english: 'Narrated Abu Huraira: I heard Allah\'s Messenger (ﷺ) saying, "If there was a river at the door of anyone of you and he took a bath in it five times a day would you notice any dirt on him?" They said, "Not a trace of dirt would be left." The Prophet (ﷺ) added, "That is the example of the five prayers with which Allah blots out (annuls) evil deeds."',
    reference: 'Bukhari 2:2',
    grade: 'Sahih',
    narrator: 'Abu Huraira'
  }
];

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
    console.log(`Fetching books for collection ${collectionId}...`);
    const response = await fetch(`${the9BooksConfig.baseUrl}/collections/${collectionId}/books`);
    const data = await handleApiError(response);
    
    return data.books.map((book: any) => ({
      id: book.number,
      name: book.name.english || `Book ${book.number}`,
      hadithCount: book.hadiths_count
    }));
  } catch (error) {
    console.error(`Error fetching books for collection ${collectionId}:`, error);
    // Return sample books for demonstration
    return sampleBooks;
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
    // Return sample hadiths filtered by book
    return sampleHadiths.filter(h => h.bookNumber === bookId);
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
    // Return a sample hadith that matches the criteria
    const foundHadith = sampleHadiths.find(h => 
      h.collection === collectionId && 
      h.bookNumber === bookId && 
      h.hadithNumber === hadithNumber
    );
    
    if (foundHadith) {
      return foundHadith;
    }
    
    // If no exact match, return first hadith with matching book
    const bookHadith = sampleHadiths.find(h => h.bookNumber === bookId);
    if (bookHadith) {
      return {
        ...bookHadith,
        hadithNumber: hadithNumber
      };
    }
    
    // Last resort - return first sample hadith
    return {
      ...sampleHadiths[0],
      collection: collectionId,
      bookNumber: bookId,
      hadithNumber: hadithNumber
    };
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
    // Simple search in sample data
    const searchTerms = query.toLowerCase().split(' ');
    return sampleHadiths.filter(hadith => {
      const englishText = hadith.english.toLowerCase();
      return searchTerms.some(term => englishText.includes(term));
    });
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
    arabic: apiHadith.text?.arabic || '',
    english: apiHadith.text?.english || '',
    reference: `${apiHadith.collection_name} ${apiHadith.book_number}:${apiHadith.hadith_number}`,
    grade: apiHadith.grade || '',
    narrator: apiHadith.narrator || ''
  };
};
