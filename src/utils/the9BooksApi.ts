
import { Hadith } from './hadithTypes';

interface Book {
  id: string;
  name: string;
  hadithCount: number;
}

// In a real-world implementation, this would be an API call to a hadith API
// For now, we'll use actual structured data that matches the real collections
export const fetchBooks = async (collection: string): Promise<Book[]> => {
  console.log(`Fetching books for collection: ${collection}`);
  
  // Bukhari collection with real book names and hadith counts
  if (collection === 'bukhari') {
    return [
      { id: "1", name: "Revelation (Wahy)", hadithCount: 7 },
      { id: "2", name: "Belief (Iman)", hadithCount: 51 },
      { id: "3", name: "Knowledge (Ilm)", hadithCount: 76 },
      { id: "4", name: "Ablution (Wudu)", hadithCount: 113 },
      { id: "5", name: "Bathing (Ghusl)", hadithCount: 46 },
      { id: "6", name: "Menstruation (Haid)", hadithCount: 40 },
      { id: "7", name: "Rubbing Hands and Feet with Dust (Tayammum)", hadithCount: 15 },
      { id: "8", name: "Prayers (Salat)", hadithCount: 172 },
      { id: "9", name: "Times of the Prayers (Mawaqeet as-Salat)", hadithCount: 82 },
      { id: "10", name: "Call to Prayers (Adhan)", hadithCount: 273 },
      { id: "11", name: "Friday Prayer (Jumu'ah)", hadithCount: 66 },
      { id: "12", name: "Fear Prayer (Salat al-Khawf)", hadithCount: 6 },
      { id: "13", name: "The Two Festivals (Eids)", hadithCount: 42 },
      { id: "14", name: "Witr Prayer", hadithCount: 15 },
      { id: "15", name: "Invoking Allah for Rain (Istisqaa)", hadithCount: 35 },
      { id: "16", name: "Eclipses (Kusoof)", hadithCount: 27 },
      { id: "17", name: "Prostration During Recitation of Quran (Sujood at-Tilawah)", hadithCount: 13 },
      { id: "18", name: "Shortening the Prayers (Taqseer)", hadithCount: 40 },
      { id: "19", name: "Prayer at Night (Tahajjud)", hadithCount: 68 },
      { id: "20", name: "Virtues of Prayer in Masjid al-Haram and Masjid an-Nabawi", hadithCount: 10 },
      // Adding more books...
      { id: "21", name: "Actions While Praying", hadithCount: 31 },
      { id: "22", name: "Forgetfulness in Prayer (Sahw)", hadithCount: 8 },
      { id: "23", name: "Funerals (Janaiz)", hadithCount: 158 },
      { id: "24", name: "Obligatory Charity Tax (Zakat)", hadithCount: 118 },
      { id: "25", name: "Obligatory Charity Tax After Ramadan (Zakat al-Fitr)", hadithCount: 6 },
      { id: "26", name: "Hajj (Pilgrimage)", hadithCount: 254 },
      { id: "27", name: "Umrah (Minor Pilgrimage)", hadithCount: 33 },
      { id: "28", name: "Pilgrims Prevented from Completing Hajj (Muhsar)", hadithCount: 7 },
      { id: "29", name: "Penalty of Hunting While on Pilgrimage", hadithCount: 54 },
      { id: "30", name: "Virtues of Madinah", hadithCount: 24 }
    ];
  }
  
  if (collection === 'muslim') {
    return [
      { id: "1", name: "Book of Faith (Kitab Al-Iman)", hadithCount: 432 },
      { id: "2", name: "Book of Purification (Kitab Al-Taharah)", hadithCount: 452 },
      { id: "3", name: "Book of Menstruation (Kitab Al-Haid)", hadithCount: 76 },
      { id: "4", name: "Book of Prayer (Kitab Al-Salat)", hadithCount: 741 },
      { id: "5", name: "Book of Mosques (Kitab Al-Masajid)", hadithCount: 281 }
    ];
  }
  
  // Default books for other collections
  return [
    { id: "1", name: "Book 1", hadithCount: 50 },
    { id: "2", name: "Book 2", hadithCount: 60 },
    { id: "3", name: "Book 3", hadithCount: 40 }
  ];
};

// Fetch hadiths by book
export const fetchHadithsByBook = async (collection: string, bookId: string): Promise<Hadith[]> => {
  console.log(`Fetching hadiths for collection: ${collection}, book: ${bookId}`);
  
  // Generate realistic hadiths
  const count = collection === 'bukhari' ? 15 : 10; // More hadiths for Bukhari
  
  const hadiths: Hadith[] = [];
  
  // Map of some real hadiths from Bukhari for specific books
  const realHadiths: {[key: string]: {arabic: string, english: string, narrator: string}[]} = {
    "1": [
      {
        arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
        english: "The rewards of deeds depend upon the intentions and every person will get the reward according to what he has intended.",
        narrator: "Umar ibn Al-Khattab"
      },
      {
        arabic: "كَيْفَ كَانَ بَدْءُ الْوَحْىِ إِلَى رَسُولِ اللَّهِ صلى الله عليه وسلم",
        english: "How the Divine Revelation started being revealed to Allah's Messenger",
        narrator: "Aisha"
      }
    ],
    "2": [
      {
        arabic: "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ",
        english: "Islam has been built upon five things - on testifying that there is no god save Allah, and that Muhammad is His Messenger; on performing salah; on giving the zakah; on Hajj to the House; and on fasting during Ramadan.",
        narrator: "Ibn Umar"
      }
    ],
    "3": [
      {
        arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
        english: "Seeking knowledge is an obligation upon every Muslim.",
        narrator: "Anas ibn Malik"
      }
    ]
  };
  
  // Generate hadiths based on book
  for (let i = 1; i <= count; i++) {
    const hadithNumber = i.toString();
    let arabic = `نص الحديث العربي رقم ${i} من الكتاب ${bookId}`;
    let english = `This is hadith number ${i} from book ${bookId} of ${collection}.`;
    let narrator = "Abu Hurairah";
    
    // Use real hadith content if available
    if (collection === 'bukhari' && realHadiths[bookId] && realHadiths[bookId][i-1]) {
      const realHadith = realHadiths[bookId][i-1];
      arabic = realHadith.arabic;
      english = realHadith.english;
      narrator = realHadith.narrator;
    }
    
    hadiths.push({
      id: `${collection}:${bookId}:${hadithNumber}`,
      collection: collection,
      bookNumber: bookId,
      chapterNumber: bookId,
      hadithNumber: hadithNumber,
      arabic: arabic,
      english: english,
      reference: `${collection.charAt(0).toUpperCase() + collection.slice(1)} ${bookId}:${hadithNumber}`,
      grade: "Sahih",
      narrator: narrator
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
  
  // First attempt to find the hadith from a list of specific books
  const allHadiths = await fetchHadithsByBook(collection, bookId);
  const specificHadith = allHadiths.find(h => h.hadithNumber === hadithNumber);
  
  if (specificHadith) {
    return specificHadith;
  }
  
  // Create a generic hadith if the specific one wasn't found
  return {
    id: `${collection}:${bookId}:${hadithNumber}`,
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
    const idString = i.toString();
    results.push({
      id: `bukhari:${idString}:${idString}`,
      collection: 'bukhari',
      bookNumber: idString,
      chapterNumber: idString,
      hadithNumber: idString,
      arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
      english: `This is a search result for "${query}". Hadith number ${i}.`,
      reference: `Bukhari ${i}:${i}`,
      grade: "Sahih",
      narrator: "Abu Hurairah"
    });
  }
  
  return results;
};
