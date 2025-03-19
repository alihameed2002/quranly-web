
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

interface BookCategory {
  id: string;
  name: string;
  range: [number, number];
}

// Full Sahih Bukhari book list with hadith ranges
const bukhariCategories: BookCategory[] = [
  { id: "1", name: "Revelation (Wahy)", range: [1, 7] },
  { id: "2", name: "Belief (Iman)", range: [8, 58] },
  { id: "3", name: "Knowledge (Ilm)", range: [59, 134] },
  { id: "4", name: "Ablution (Wudu)", range: [135, 247] },
  { id: "5", name: "Bathing (Ghusl)", range: [248, 293] },
  { id: "6", name: "Menstruation (Haid)", range: [294, 333] },
  { id: "7", name: "Rubbing Hands and Feet with Dust (Tayammum)", range: [334, 348] },
  { id: "8", name: "Prayers (Salat)", range: [349, 520] },
  { id: "9", name: "Times of the Prayers (Mawaqeet as-Salat)", range: [521, 602] },
  { id: "10", name: "Call to Prayers (Adhan)", range: [603, 875] },
  { id: "11", name: "Friday Prayer (Jumu'ah)", range: [876, 941] },
  { id: "12", name: "Fear Prayer (Salat al-Khawf)", range: [942, 947] },
  { id: "13", name: "The Two Festivals (Eids)", range: [948, 989] },
  { id: "14", name: "Witr Prayer", range: [990, 1004] },
  { id: "15", name: "Invoking Allah for Rain (Istisqaa)", range: [1005, 1039] },
  { id: "16", name: "Eclipses (Kusoof)", range: [1040, 1066] },
  { id: "17", name: "Prostration During Recitation of Quran (Sujood at-Tilawah)", range: [1067, 1079] },
  { id: "18", name: "Shortening the Prayers (Taqseer)", range: [1080, 1119] },
  { id: "19", name: "Prayer at Night (Tahajjud)", range: [1120, 1187] },
  { id: "20", name: "Virtues of Prayer in Masjid al-Haram and Masjid an-Nabawi", range: [1188, 1197] },
  { id: "21", name: "Actions While Praying", range: [1198, 1228] },
  { id: "22", name: "Forgetfulness in Prayer (Sahw)", range: [1229, 1236] },
  { id: "23", name: "Funerals (Janaiz)", range: [1237, 1394] },
  { id: "24", name: "Obligatory Charity Tax (Zakat)", range: [1395, 1512] },
  { id: "25", name: "Obligatory Charity Tax After Ramadan (Zakat al-Fitr)", range: [1513, 1518] },
  { id: "26", name: "Hajj (Pilgrimage)", range: [1519, 1772] },
  { id: "27", name: "Umrah (Minor Pilgrimage)", range: [1773, 1805] },
  { id: "28", name: "Pilgrims Prevented from Completing Hajj (Muhsar)", range: [1806, 1812] },
  { id: "29", name: "Penalty of Hunting While on Pilgrimage", range: [1813, 1866] },
  { id: "30", name: "Virtues of Madinah", range: [1867, 1890] },
  { id: "31", name: "Fasting (Sawm)", range: [1891, 2007] },
  { id: "32", name: "Praying at Night in Ramadan (Taraweeh)", range: [2008, 2013] },
  { id: "33", name: "Retreat (I'tikaf)", range: [2014, 2046] },
  { id: "34", name: "Sales and Trade (Buyu)", range: [2047, 2238] },
  { id: "35", name: "Sales in Which a Price is Paid at a Later Date (Salam)", range: [2239, 2256] },
  { id: "36", name: "Pre-emption (Shuf'a)", range: [2257, 2259] },
  { id: "37", name: "Hiring (Ijara)", range: [2260, 2289] },
  { id: "38", name: "Transferring a Debt (Hawala)", range: [2287, 2291] },
  { id: "39", name: "Representation or Authorization (Wakala)", range: [2292, 2319] },
  { id: "40", name: "Agriculture (Muzara'a)", range: [2320, 2350] },
  { id: "41", name: "Distribution of Water (Musaqat)", range: [2351, 2383] },
  { id: "42", name: "Loans, Payment of Loans, Freezing of Property (Qard)", range: [2384, 2409] },
  { id: "43", name: "Disputes (Khusoomaat)", range: [2410, 2415] },
  { id: "44", name: "Lost Things Picked Up by Someone (Luqata)", range: [2416, 2439] },
  { id: "45", name: "Oppressions (Mazalim)", range: [2440, 2482] },
  { id: "46", name: "Partnership (Shirkah)", range: [2483, 2507] },
  { id: "47", name: "Mortgaging (Rahn)", range: [2508, 2515] },
  { id: "48", name: "Manumission of Slaves (Itq)", range: [2516, 2559] },
  { id: "49", name: "Gifts (Hiba)", range: [2560, 2636] },
  { id: "50", name: "Witnesses (Shahadat)", range: [2637, 2674] },
  { id: "51", name: "Peacemaking (Sulh)", range: [2675, 2706] },
  { id: "52", name: "Conditions (Shurut)", range: [2707, 2737] },
  { id: "53", name: "Wills and Testaments (Wasaya)", range: [2738, 2781] },
  { id: "54", name: "Fighting for the Cause of Allah (Jihad)", range: [2782, 3090] },
  { id: "55", name: "One-Fifth of Booty to the Cause of Allah (Khums)", range: [3091, 3155] },
  { id: "56", name: "Jizyah and Mawaada'ah (Tax from Non-Muslims)", range: [3156, 3189] },
  { id: "57", name: "Beginning of Creation (Bad' al-Khalq)", range: [3190, 3325] },
  { id: "58", name: "Prophets (Anbiya)", range: [3326, 3488] },
  { id: "59", name: "Virtues and Merits of the Prophet and His Companions (Manaqib)", range: [3489, 3648] },
  { id: "60", name: "Companions of the Prophet (Manaqib al-Ansar)", range: [3649, 3948] },
  { id: "61", name: "Merits of the Helpers in Madinah (Ansar)", range: [3949, 4066] },
  { id: "62", name: "Marriage (Nikah)", range: [5063, 5250] },
  { id: "63", name: "Divorce (Talaq)", range: [5251, 5332] },
  { id: "64", name: "Supporting the Family (Nafaqa)", range: [5333, 5364] },
  { id: "65", name: "Food, Meals (At'ima)", range: [5365, 5451] },
  { id: "66", name: "Sacrifice on Occasion of Birth (Aqiqa)", range: [5452, 5474] },
  { id: "67", name: "Hunting, Slaughtering (Dhabh)", range: [5475, 5563] },
  { id: "68", name: "Al-Adha Festival Sacrifice (Udhiyya)", range: [5564, 5577] },
  { id: "69", name: "Drinks (Ashriba)", range: [5578, 5639] },
  { id: "70", name: "Patients (Marda)", range: [5640, 5677] },
  { id: "71", name: "Medicine (Tibb)", range: [5678, 5765] },
  { id: "72", name: "Dress (Libas)", range: [5766, 5885] },
  { id: "73", name: "Good Manners and Form (Adab)", range: [5886, 6079] },
  { id: "74", name: "Asking Permission (Isti'dhan)", range: [6080, 6303] },
  { id: "75", name: "Invocations (Da'awat)", range: [6304, 6411] },
  { id: "76", name: "Softening the Heart (Riqaq)", range: [6412, 6578] },
  { id: "77", name: "Divine Will (Qadar)", range: [6579, 6619] },
  { id: "78", name: "Oaths and Vows (Ayman wa al-Nudhur)", range: [6620, 6707] },
  { id: "79", name: "Expiation for Unfulfilled Oaths (Kaffara)", range: [6708, 6722] },
  { id: "80", name: "Laws of Inheritance (Fara'id)", range: [6723, 6771] },
  { id: "81", name: "Limits and Punishments Set by Allah (Hudud)", range: [6772, 6859] },
  { id: "82", name: "Blood Money (Diyaat)", range: [6860, 6917] },
  { id: "83", name: "Apostates (Murtaddin)", range: [6918, 6925] },
  { id: "84", name: "Coercion (Ikrah)", range: [6926, 6952] },
  { id: "85", name: "Tricks (Hiyal)", range: [6953, 6970] },
  { id: "86", name: "Interpretation of Dreams (Ta'beer)", range: [6971, 7047] },
  { id: "87", name: "Afflictions and the End of the World (Fitan)", range: [7048, 7136] },
  { id: "88", name: "Judgments (Ahkam)", range: [7137, 7214] },
  { id: "89", name: "Wishes (Tamanni)", range: [7215, 7235] },
  { id: "90", name: "Accepting Information Given by a Truthful Person (Tawassul)", range: [7236, 7245] },
  { id: "91", name: "Holding Fast to the Quran and Sunnah (I'tisam)", range: [7246, 7298] },
  { id: "92", name: "Oneness of Allah (Tawheed)", range: [7299, 7563] }
];

interface BukhariBookSelectorProps {
  currentBook: string;
  currentHadith: string;
  onSelectBook: (bookId: string) => void;
  onSelectHadith: (hadithNumber: string) => void;
}

export default function BukhariBookSelector({
  currentBook,
  currentHadith,
  onSelectBook,
  onSelectHadith
}: BukhariBookSelectorProps) {
  const [currentBookName, setCurrentBookName] = useState('');
  
  // Find the current book name
  useEffect(() => {
    const category = bukhariCategories.find(cat => cat.id === currentBook);
    if (category) {
      setCurrentBookName(category.name);
    } else {
      setCurrentBookName(`Book ${currentBook}`);
    }
  }, [currentBook]);
  
  // Generate hadith number ranges for the current book
  const getHadithSubMenuItems = (category: BookCategory) => {
    const [start, end] = category.range;
    const items = [];
    
    // Create groups of 10 hadiths for better organization
    const step = 10;
    for (let i = start; i <= end; i += step) {
      const rangeEnd = Math.min(i + step - 1, end);
      
      if (end - start < 20) {
        // For smaller books, show individual hadiths
        for (let j = i; j <= rangeEnd; j++) {
          items.push(
            <DropdownMenuItem 
              key={`hadith-${j}`}
              onClick={() => onSelectHadith(j.toString())}
            >
              Hadith {j}
            </DropdownMenuItem>
          );
        }
      } else {
        // For larger books, show ranges
        items.push(
          <DropdownMenuSub key={`range-${i}`}>
            <DropdownMenuSubTrigger>
              Hadith {i}-{rangeEnd}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-app-background-dark border-app-border">
                {Array.from({ length: rangeEnd - i + 1 }).map((_, index) => {
                  const hadithNumber = i + index;
                  return (
                    <DropdownMenuItem 
                      key={`hadith-${hadithNumber}`}
                      onClick={() => onSelectHadith(hadithNumber.toString())}
                    >
                      Hadith {hadithNumber}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        );
      }
    }
    
    return items;
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center glass-card rounded-lg px-4 py-2 text-white border border-app-border hover:bg-white/5">
        <span className="mr-2 truncate max-w-[200px]">
          {currentBookName} - Hadith {currentHadith}
        </span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        className="max-h-[400px] overflow-y-auto w-[300px] bg-app-background-dark border-app-border text-white"
      >
        <DropdownMenuLabel>Select Book & Hadith</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-app-border" />
        
        <DropdownMenuGroup>
          {bukhariCategories.map((category) => (
            <DropdownMenuSub key={category.id}>
              <DropdownMenuSubTrigger
                className={currentBook === category.id ? "bg-white/10" : ""}
              >
                {category.name}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-app-background-dark border-app-border">
                  <DropdownMenuItem 
                    onClick={() => {
                      onSelectBook(category.id);
                      onSelectHadith(category.range[0].toString());
                    }}
                  >
                    First Hadith ({category.range[0]})
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-app-border" />
                  {getHadithSubMenuItems(category)}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
