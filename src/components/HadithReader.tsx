import { ChevronLeft, ChevronRight, Search, ChevronsLeft, ChevronsRight, Shuffle, ChevronDown, X, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import HadithCard from "./HadithCard";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Hadith } from "@/utils/hadithTypes";
import { 
  getHadith,
  getBooks,
  getAllHadiths,
  getTotalHadithCount,
  getHadithByIndex,
  COLLECTION_MAP,
  listCollections,
  BUKHARI_BOOK_STRUCTURE,
  getBookFromHadithNumber
} from "@/utils/hadithDatabase";
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface HadithReaderProps {
  className?: string;
  initialCollection?: string;
  initialBook?: string;
  initialHadith?: string;
}

interface Book {
  bookNumber: string;
  bookName: string;
  hadithCount: number;
}

const BUKHARI_CATEGORIES: { [key: string]: { start: number; end: number; name: string } } = {
  "Revelation": { start: 1, end: 7, name: "Revelation (Kitab Al-Wahi)" },
  "Belief": { start: 8, end: 58, name: "Belief (Kitab Al-Iman)" },
  "Knowledge": { start: 59, end: 134, name: "Knowledge (Kitab Al-Ilm)" },
  "Ablutions": { start: 135, end: 247, name: "Ablutions (Wudu') (Kitab Al-Wudu')" },
  "Bathing": { start: 248, end: 293, name: "Bathing (Ghusl) (Kitab Al-Ghusl)" },
  "MenstrualPeriods": { start: 294, end: 333, name: "Menstrual Periods (Kitab Al-Haid)" },
  "Tayammum": { start: 334, end: 348, name: "Rubbing Hands and Feet with Dust (Tayammum) (Kitab At-Tayammum)" },
  "Prayers": { start: 349, end: 520, name: "Prayers (Salat) (Kitab As-Salat)" },
  "PrayerTimes": { start: 521, end: 602, name: "Times of the Prayers (Kitab Mawaqit As-Salat)" },
  "Adhan": { start: 603, end: 875, name: "Call to Prayers (Adhan) (Kitab Al-Adhan)" },
  "FridayPrayer": { start: 876, end: 941, name: "Friday Prayer (Kitab Al-Jumu'ah)" },
  "FearPrayer": { start: 942, end: 947, name: "Fear Prayer (Kitab Salat Al-Khawf)" },
  "Eids": { start: 948, end: 989, name: "The Two Festivals (Eids) (Kitab Al-Idayn)" },
  "WitrPrayer": { start: 990, end: 1004, name: "Witr Prayer (Kitab Al-Witr)" },
  "Istisqa": { start: 1005, end: 1039, name: "Invoking Allah for Rain (Istisqa) (Kitab Al-Istisqa)" },
  "Eclipses": { start: 1040, end: 1066, name: "Eclipses (Kitab Al-Kusuf)" },
  "Prostration": { start: 1067, end: 1079, name: "Prostration During Recital of Quran (Kitab Sujud Al-Quran)" },
  "ShorteningPrayers": { start: 1080, end: 1119, name: "Shortening the Prayers (At-Taqseer) (Kitab At-Taqseer)" },
  "NightPrayers": { start: 1120, end: 1187, name: "Prayer at Night (Tahajjud) (Kitab At-Tahajjud)" },
  "PrayerVirtues": { start: 1188, end: 1197, name: "Virtues of Prayer in Makkah and Madinah (Kitab Fadl As-Salat fi Masjid Makkah wa Madinah)" },
  "PrayerActions": { start: 1198, end: 1228, name: "Actions While Praying (Kitab Al-Amal fi As-Salat)" },
  "Forgetfulness": { start: 1229, end: 1236, name: "Forgetfulness in Prayer (Kitab As-Sahw)" },
  "Funerals": { start: 1237, end: 1394, name: "Funerals (Al-Jana'iz) (Kitab Al-Jana'iz)" },
  "Zakat": { start: 1395, end: 1512, name: "Obligatory Charity Tax (Zakat) (Kitab Az-Zakat)" },
  "ZakatFitr": { start: 1513, end: 1518, name: "Obligatory Charity Tax After Ramadan (Zakat al-Fitr) (Kitab Zakat Al-Fitr)" },
  "Hajj": { start: 1519, end: 1772, name: "Hajj (Pilgrimage) (Kitab Al-Hajj)" },
  "Umrah": { start: 1773, end: 1805, name: "Umrah (Minor Pilgrimage) (Kitab Al-Umrah)" },
  "PreventedPilgrims": { start: 1806, end: 1812, name: "Pilgrims Prevented from Completing Hajj (Kitab Al-Muhsar)" },
  "HuntingPenalty": { start: 1813, end: 1866, name: "Penalty of Hunting While on Pilgrimage (Kitab Jazaa As-Said)" },
  "MadinahVirtues": { start: 1867, end: 1890, name: "Virtues of Madinah (Kitab Fada'il Al-Madinah)" },
  "Fasting": { start: 1891, end: 2007, name: "Fasting (Kitab As-Sawm)" },
  "Taraweeh": { start: 2008, end: 2013, name: "Praying at Night in Ramadan (Taraweeh) (Kitab Salat At-Tarawih)" },
  "NightOfQadr": { start: 2014, end: 2024, name: "Virtues of the Night of Qadr (Kitab Fadl Lailat Al-Qadr)" },
  "Itikaf": { start: 2025, end: 2046, name: "Retreat (I'tikaf) (Kitab Al-I'tikaf)" },
  "Sales": { start: 2047, end: 2238, name: "Sales and Trade (Kitab Al-Buyu)" },
  "Salam": { start: 2239, end: 2256, name: "Sales in Which a Price is Paid Later (Salam) (Kitab As-Salam)" },
  "Preemption": { start: 2257, end: 2259, name: "Pre-emption (Shuf'a) (Kitab Ash-Shuf'a)" },
  "Hiring": { start: 2260, end: 2286, name: "Hiring (Kitab Al-Ijarah)" },
  "DebtTransfer": { start: 2287, end: 2289, name: "Transfer of Debt (Hawala) (Kitab Al-Hawala)" },
  "Agency": { start: 2290, end: 2319, name: "Representation or Agency (Wakala) (Kitab Al-Wakala)" },
  "Agriculture": { start: 2320, end: 2350, name: "Agriculture (Kitab Al-Muzara'a)" },
  "Watering": { start: 2351, end: 2383, name: "Watering (Kitab Al-Musaaqa)" },
  "Loans": { start: 2384, end: 2409, name: "Loans, Payment of Loans, Freezing of Property, Bankruptcy (Kitab Al-Istikrad)" },
  "LostThings": { start: 2410, end: 2439, name: "Lost Things Picked Up by Someone (Luqata) (Kitab Al-Luqata)" },
  "Oppressions": { start: 2440, end: 2482, name: "Oppressions (Kitab Al-Mazalim)" },
  "Partnership": { start: 2483, end: 2507, name: "Partnership (Kitab Ash-Shirka)" },
  "Pledging": { start: 2508, end: 2515, name: "Pledging (Kitab Ar-Rahn)" },
  "Manumission": { start: 2516, end: 2559, name: "Manumission of Slaves (Kitab Al-Itq)" },
  "Gifts": { start: 2560, end: 2636, name: "Gifts (Kitab Al-Hibat)" },
  "Witnesses": { start: 2637, end: 2689, name: "Witnesses (Kitab Ash-Shahadat)" },
  "Peacemaking": { start: 2690, end: 2707, name: "Peacemaking (Kitab As-Sulh)" },
  "Conditions": { start: 2708, end: 2737, name: "Conditions (Kitab Ash-Shurut)" },
  "Wills": { start: 2738, end: 2781, name: "Wills and Testaments (Wasaayaa) (Kitab Al-Wasaayaa)" },
  "Jihad": { start: 2782, end: 3090, name: "Fighting for the Cause of Allah (Jihaad) (Kitab Al-Jihad)" },
  "Khums": { start: 3091, end: 3155, name: "One-fifth of Booty to the Cause of Allah (Khums) (Kitab Al-Khums)" },
  "Jizyah": { start: 3156, end: 3189, name: "Jizyah and Mawaada'ah (Kitab Al-Jizya)" },
  "Creation": { start: 3190, end: 3325, name: "Beginning of Creation (Kitab Bad' Al-Khalq)" },
  "Prophets": { start: 3326, end: 3488, name: "Prophets (Kitab Ahadith Al-Anbiya)" },
  "ProphetVirtues": { start: 3489, end: 3775, name: "Virtues and Merits of the Prophet and His Companions (Kitab Al-Fada'il)" },
  "Companions": { start: 3776, end: 3896, name: "Companions of the Prophet (Kitab Fada'il Ashab An-Nabi)" },
  "SunnahMerits": { start: 3897, end: 3913, name: "Merits of Sunnah (Kitab Al-I'tisam)" },
  "MilitaryExpeditions": { start: 3914, end: 4473, name: "Military Expeditions Led by the Prophet (Kitab Al-Maghaazi)" },
  "QuranCommentary": { start: 4474, end: 4977, name: "Commentary on the Quran (Kitab At-Tafsir)" },
  "QuranVirtues": { start: 4978, end: 5107, name: "Virtues of the Quran (Kitab Fada'il Al-Quran)" },
  "Marriage": { start: 5108, end: 5250, name: "Marriage (Kitab An-Nikah)" },
  "Divorce": { start: 5251, end: 5332, name: "Divorce (Kitab At-Talaq)" },
  "FamilySupport": { start: 5333, end: 5364, name: "Supporting the Family (Kitab An-Nafaqat)" },
  "Food": { start: 5365, end: 5466, name: "Food, Meals (Kitab Al-At'ima)" },
  "Aqiqa": { start: 5467, end: 5474, name: "Sacrifice on Occasion of Birth (Aqiqa) (Kitab Al-Aqiqa)" },
  "SlaughteringHunting": { start: 5475, end: 5569, name: "Slaughtering and Hunting (Kitab Adh-Dhaba'ih)" },
  "Sacrifices": { start: 5570, end: 5614, name: "Al-Adahi (Sacrifices) (Kitab Al-Adahi)" },
  "Drinks": { start: 5615, end: 5639, name: "Drinks (Kitab Al-Ashriba)" },
  "Patients": { start: 5640, end: 5678, name: "Patients (Kitab Al-Marda)" },
  "Medicine": { start: 5679, end: 5769, name: "Medicine (Kitab At-Tibb)" },
  "Dress": { start: 5770, end: 5878, name: "Dress (Kitab Al-Libas)" },
  "GoodManners": { start: 5879, end: 6226, name: "Good Manners and Form (Al-Adab) (Kitab Al-Adab)" },
  "AskingPermission": { start: 6227, end: 6303, name: "Asking Permission (Kitab Al-Isti'dhan)" },
  "Invocations": { start: 6304, end: 6411, name: "Invocations (Kitab Ad-Da'awat)" },
  "SofteningHearts": { start: 6412, end: 6593, name: "Softening of Hearts (Kitab Ar-Riqaq)" },
  "DivineWill": { start: 6594, end: 6620, name: "Divine Will (Qadar) (Kitab Al-Qadar)" },
  "OathsVows": { start: 6621, end: 6707, name: "Oaths and Vows (Kitab Al-Ayman wa An-Nudhur)" },
  "Expiation": { start: 6708, end: 6726, name: "Expiation for Unfulfilled Oaths (Kitab Kafarat Al-Ayman)" },
  "Inheritance": { start: 6727, end: 6771, name: "Laws of Inheritance (Kitab Al-Fara'id)" },
  "Hudood": { start: 6772, end: 6860, name: "Limits and Punishments Set by Allah (Hudood) (Kitab Al-Hudud)" },
  "BloodMoney": { start: 6861, end: 6917, name: "Blood Money (Ad-Diyat) (Kitab Ad-Diyat)" },
  "Apostates": { start: 6918, end: 6925, name: "Apostates (Kitab Al-Murtaddin)" },
  "Coercion": { start: 6926, end: 6952, name: "Coercion (Kitab Al-Ikrah)" },
  "Tricks": { start: 6953, end: 6981, name: "Tricks (Kitab Al-Hiyal)" },
  "Dreams": { start: 6982, end: 7047, name: "Interpretation of Dreams (Kitab Ta'bir Ar-Ru'ya)" },
  "Afflictions": { start: 7048, end: 7136, name: "Afflictions and the End of the World (Kitab Al-Fitan)" },
  "Judgments": { start: 7137, end: 7225, name: "Judgments (Ahkaam) (Kitab Al-Ahkaam)" },
  "Wishes": { start: 7226, end: 7245, name: "Wishes (Kitab At-Tamanni)" },
  "AcceptingInfo": { start: 7246, end: 7268, name: "Accepting Information Given by a Truthful Person (Kitab Qabul Al-Akhbar)" },
  "HoldingFast": { start: 7269, end: 7370, name: "Holding Fast to the Quran and Sunnah (Kitab Al-I'tisam Bil-Kitab wa As-Sunnah)" },
  "Tawheed": { start: 7371, end: 7563, name: "Oneness of Allah (Tawheed) (Kitab At-Tawheed)" },
};

const MUSLIM_CATEGORIES: { [key: string]: { start: number; end: number; name: string } } = {
  "Faith": { start: 1, end: 432, name: "Faith (Kitab Al-Iman)" },
  "Purification": { start: 433, end: 884, name: "Purification (Kitab Al-Taharah)" },
  "Menstruation": { start: 885, end: 961, name: "Menstruation (Kitab Al-Haid)" },
  "Prayer": { start: 962, end: 1702, name: "Prayer (Kitab Al-Salat)" },
  "Mosques": { start: 1703, end: 1983, name: "Mosques and Places of Prayer (Kitab Al-Masajid wa Mawadi' Al-Salat)" },
  "TravellersPrayer": { start: 1984, end: 2177, name: "Travellers' Prayer (Kitab Salat Al-Musafirin wa Qasraha)" },
  "FridayPrayer": { start: 2178, end: 2251, name: "Friday Prayer (Kitab Al-Jumu'ah)" },
  "EidPrayers": { start: 2252, end: 2282, name: "Two Eids (Kitab Al-'Idain)" },
  "RainPrayer": { start: 2283, end: 2309, name: "Prayer for Rain (Kitab Salat Al-Istisqa')" },
  "Eclipses": { start: 2310, end: 2363, name: "Eclipses (Kitab Al-Kusuf)" },
  "FuneralPrayer": { start: 2364, end: 2451, name: "Funeral Prayer (Kitab Al-Jana'iz)" },
  "Zakat": { start: 2452, end: 2721, name: "Zakat (Kitab Al-Zakat)" },
  "Fasting": { start: 2722, end: 3081, name: "Fasting (Kitab Al-Siyam)" },
  "Itikaf": { start: 3082, end: 3108, name: "Seclusion (I'tikaf) (Kitab Al-I'tikaf)" },
  "Pilgrimage": { start: 3109, end: 3696, name: "Pilgrimage (Kitab Al-Hajj)" },
  "Marriage": { start: 3697, end: 4066, name: "Marriage (Kitab Al-Nikah)" },
  "Divorce": { start: 4067, end: 4199, name: "Divorce (Kitab Al-Talaq)" },
  "Transactions": { start: 4200, end: 4492, name: "Transactions (Kitab Al-Buyu')" },
  "Musaqah": { start: 4493, end: 4590, name: "Musaqah (Kitab Al-Musaqah)" },
  "Inheritance": { start: 4591, end: 4663, name: "Inheritance (Kitab Al-Faraid)" },
  "Gifts": { start: 4664, end: 4798, name: "Gifts (Kitab Al-Hibat)" },
  "Wills": { start: 4799, end: 4886, name: "Wills (Kitab Al-Wasiyah)" },
  "Oaths": { start: 4887, end: 4973, name: "Oaths (Kitab Al-Nadhr)" },
  "Oaths2": { start: 4974, end: 5138, name: "Oaths (Kitab Al-Aiman)" },
  "Judicial": { start: 5139, end: 5183, name: "Judicial Decisions (Kitab Al-Aqdiyah)" },
  "LostProperty": { start: 5184, end: 5191, name: "Lost Property (Kitab Al-Luqatah)" },
  "Jihad": { start: 5192, end: 5629, name: "Jihad and Expeditions (Kitab Al-Jihad wa Al-Siyar)" },
  "Leadership": { start: 5630, end: 6002, name: "Leadership (Kitab Al-Imarah)" },
  "HuntingSlaughter": { start: 6003, end: 6069, name: "Hunting, Slaughter (Kitab Al-Said wa Al-Dhaba'ih)" },
  "Sacrifices": { start: 6070, end: 6089, name: "Sacrifices (Kitab Al-Adahi)" },
  "Drinks": { start: 6090, end: 6234, name: "Drinks (Kitab Al-Ashribah)" },
  "Clothing": { start: 6235, end: 6370, name: "Clothing and Adornment (Kitab Al-Libas wa Al-Zinah)" },
  "Manners": { start: 6371, end: 6446, name: "Manners and Etiquette (Kitab Al-Adab)" },
  "Salutations": { start: 6447, end: 6579, name: "Salutations and Greetings (Kitab Al-Salam)" },
  "Etiquette": { start: 6580, end: 6634, name: "Etiquette of Eating (Kitab Al-Alfaz min Al-Adab)" },
  "Poetry": { start: 6635, end: 6648, name: "Poetry (Kitab Al-Shi'r)" },
  "Dreams": { start: 6649, end: 6682, name: "Dreams (Kitab Al-Ru'ya)" },
  "Virtues": { start: 6683, end: 7029, name: "Virtues (Kitab Al-Fada'il)" },
  "ProphetCompanions": { start: 7030, end: 7389, name: "Virtues of the Companions (Kitab Fada'il Al-Sahabah)" },
  "Righteousness": { start: 7390, end: 7649, name: "Righteousness, Good Manners (Kitab Al-Birr wa Al-Silah wa Al-Adab)" },
  "Destiny": { start: 7650, end: 7747, name: "Destiny (Kitab Al-Qadar)" },
  "Knowledge": { start: 7748, end: 7777, name: "Knowledge (Kitab Al-'Ilm)" },
  "Remembrance": { start: 7778, end: 8094, name: "Remembrance of Allah (Kitab Al-Dhikr)" },
  "Repentance": { start: 8095, end: 8193, name: "Repentance (Kitab Al-Taubah)" },
  "HeartSofteners": { start: 8194, end: 8257, name: "Heart-Melting Traditions (Kitab Al-Riqaq)" },
  "Resurrection": { start: 8258, end: 8391, name: "Resurrection, Paradise, Hell (Kitab Sifat Al-Qiyamah wa Al-Jannah wa Al-Nar)" },
  "Tribulations": { start: 8392, end: 8589, name: "Tribulations and Portents of the Last Hour (Kitab Al-Fitan wa Ashrat Al-Sa`ah)" },
  "Asceticism": { start: 8590, end: 8626, name: "Asceticism and Softening of Hearts (Kitab Al-Zuhd wa Al-Raqa'iq)" },
  "Exegesis": { start: 8627, end: 8736, name: "Exegesis of the Quran (Kitab Al-Tafsir)" }
};

const ABUDAWUD_CATEGORIES: { [key: string]: { start: number; end: number; name: string } } = {
  "Purification": { start: 1, end: 390, name: "Purification (Kitab Al-Taharah)" },
  "Prayer": { start: 391, end: 1555, name: "Prayer (Kitab Al-Salat)" },
  "Zakat": { start: 1556, end: 1700, name: "Zakat (Kitab Al-Zakat)" },
};

const TIRMIDHI_CATEGORIES: { [key: string]: { start: number; end: number; name: string } } = {
  "Purification": { start: 1, end: 147, name: "Purification (Kitab Al-Taharah)" },
  "Prayer": { start: 148, end: 452, name: "Prayer (Kitab Al-Salat)" },
};

const NASAI_CATEGORIES: { [key: string]: { start: number; end: number; name: string } } = {
  "Purification": { start: 1, end: 308, name: "Purification (Kitab Al-Taharah)" },
  "Water": { start: 309, end: 327, name: "Water (Kitab Al-Miyah)" },
};

const NAWAWI40_CATEGORIES: { [key: string]: { start: number; end: number; name: string } } = {
  "FortyHadith": { start: 1, end: 42, name: "The Forty Hadith of Imam Nawawi" }
};

const getHadithCategory = (hadithNumber: string, collection: string): string => {
  const num = parseInt(hadithNumber);
  if (isNaN(num)) return "Unknown";
  
  let categories: { [key: string]: { start: number; end: number; name: string } } = {};
  
  switch (collection) {
    case "bukhari":
      categories = BUKHARI_CATEGORIES;
      break;
    case "muslim":
      categories = MUSLIM_CATEGORIES;
      break;
    case "abudawud":
      categories = ABUDAWUD_CATEGORIES;
      break;
    case "tirmidhi":
      categories = TIRMIDHI_CATEGORIES;
      break;
    case "nasai":
      categories = NASAI_CATEGORIES;
      break;
    case "nawawi40":
      categories = NAWAWI40_CATEGORIES;
      break;
    default:
      return `${COLLECTION_MAP[collection] || collection} - Hadith ${hadithNumber}`;
  }
  
  for (const [key, category] of Object.entries(categories)) {
    if (num >= category.start && num <= category.end) {
      return category.name;
    }
  }
  
  return `${COLLECTION_MAP[collection] || collection} - Hadith ${hadithNumber}`;
};

// Helper functions for the hadith browser UI
interface CategoryGroup {
  [group: string]: [string, { start: number; end: number; name: string }][];
}

// Using BUKHARI_BOOK_STRUCTURE imported from hadithDatabase instead of defining BOOK_HADITH_RANGES here

const groupCategories = (categories: { [key: string]: { start: number; end: number; name: string } }): CategoryGroup => {
  const groups: CategoryGroup = {
    "Belief & Knowledge": [],
    "Prayer & Worship": [],
    "Fasting & Pilgrimage": [],
    "Transactions & Business": [],
    "Marriage & Family": [],
    "Ethics & Manners": [],
    "Jihad & Leadership": [],
    "Medicine & Dreams": [],
    "Quran & Sunnah": []
  };
  
  Object.entries(categories).forEach(([key, category]) => {
    // Assign categories to groups based on their themes
    if (["Revelation", "Belief", "Knowledge", "Tawheed", "HoldingFast", "AcceptingInfo"].includes(key)) {
      groups["Belief & Knowledge"].push([key, category]);
    } else if (["Ablutions", "Bathing", "MenstrualPeriods", "Tayammum", "Prayers", "PrayerTimes", "Adhan", "FridayPrayer", "FearPrayer", "Eids", "WitrPrayer", "Istisqa", "Eclipses", "Prostration", "ShorteningPrayers", "NightPrayers", "PrayerVirtues", "PrayerActions", "Forgetfulness", "Funerals"].includes(key)) {
      groups["Prayer & Worship"].push([key, category]);
    } else if (["Zakat", "Fasting", "Taraweeh", "NightOfQadr", "Itikaf", "Hajj", "Umrah", "PreventedPilgrims", "HuntingPenalty", "MadinahVirtues"].includes(key)) {
      groups["Fasting & Pilgrimage"].push([key, category]);
    } else if (["Sales", "Salam", "Preemption", "Hiring", "DebtTransfer", "Agency", "Agriculture", "Watering", "Loans", "LostThings", "Oppressions", "Partnership", "Pledging"].includes(key)) {
      groups["Transactions & Business"].push([key, category]);
    } else if (["Manumission", "Gifts", "Witnesses", "Peacemaking", "Conditions", "Wills", "Marriage", "Divorce", "FamilySupport", "Inheritance"].includes(key)) {
      groups["Marriage & Family"].push([key, category]);
    } else if (["Food", "Aqiqa", "SlaughteringHunting", "Sacrifices", "Drinks", "Dress", "GoodManners", "AskingPermission", "Invocations", "SofteningHearts", "DivineWill", "OathsVows", "Expiation"].includes(key)) {
      groups["Ethics & Manners"].push([key, category]);
    } else if (["Jihad", "Khums", "Jizyah", "ProphetVirtues", "Companions", "SunnahMerits", "MilitaryExpeditions", "Hudood", "BloodMoney", "Apostates", "Coercion", "Tricks"].includes(key)) {
      groups["Jihad & Leadership"].push([key, category]);
    } else if (["Patients", "Medicine", "Dreams", "Afflictions", "Judgments", "Wishes"].includes(key)) {
      groups["Medicine & Dreams"].push([key, category]);
    } else if (["Creation", "Prophets", "QuranCommentary", "QuranVirtues"].includes(key)) {
      groups["Quran & Sunnah"].push([key, category]);
    } else {
      // Add any unmatched categories to Quran & Sunnah as a fallback
      groups["Quran & Sunnah"].push([key, category]);
    }
  });
  
  // Filter out empty groups
  const filteredGroups: CategoryGroup = {};
  Object.entries(groups).forEach(([group, categories]) => {
    if (categories.length > 0) {
      filteredGroups[group] = categories;
    }
  });
  
  return filteredGroups;
};

const getBookNumberFromHadith = (hadithNum: string): string => {
  const num = parseInt(hadithNum);
  if (isNaN(num)) return "1";
  
  // Use the function from hadithDatabase
  return getBookFromHadithNumber(num);
};

const getFirstHadithInBook = (bookNum: string): string => {
  const range = BUKHARI_BOOK_STRUCTURE[bookNum];
  return range ? range.start.toString() : "1";
};

// Update the drawer header to show proper book count
const TOTAL_BOOKS = Object.keys(BUKHARI_BOOK_STRUCTURE).length;
// Calculate total hadiths by finding the highest end number in the structure
const TOTAL_HADITHS = Math.max(...Object.values(BUKHARI_BOOK_STRUCTURE).map(book => book.end));

export default function HadithReader({
  className,
  initialCollection = "bukhari",
  initialBook = "1",
  initialHadith = "1"
}: HadithReaderProps) {
  const [currentCollection, setCurrentCollection] = useState<string>("bukhari");
  const [currentBook, setCurrentBook] = useState<string>(initialBook);
  const [currentHadith, setCurrentHadith] = useState<string>(initialHadith);
  const [hadithData, setHadithData] = useState<Hadith | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [totalHadiths, setTotalHadiths] = useState<number>(0);
  const [isFirstHadith, setIsFirstHadith] = useState<boolean>(false);
  const [isLastHadith, setIsLastHadith] = useState<boolean>(false);
  const [collections, setCollections] = useState<{id: string, name: string}[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [hadithsInBook, setHadithsInBook] = useState<string[]>([]);
  const [selectedBookForSubmenu, setSelectedBookForSubmenu] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{ key: string, category: { start: number; end: number; name: string } } | null>(null);
  const [hadithFilter, setHadithFilter] = useState<string>("");
  const [hadithSubRanges, setHadithSubRanges] = useState<number[][]>([]);
  const [activeSubRange, setActiveSubRange] = useState<number>(0);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const fromSearch = location.state?.fromSearch || false;
  const searchQuery = location.state?.lastQuery || "";
  const searchResults = location.state?.results || [];
  const scrollPosition = location.state?.scrollPosition || 0;
  
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const booksList = await getBooks(currentCollection);
        setBooks(booksList);
      } catch (error) {
        console.error("Failed to load books:", error);
        setError("Failed to load books for the selected collection");
      }
    };
    
    loadBooks();
  }, [currentCollection]);
  
  useEffect(() => {
    const loadHadithsInBook = async () => {
      try {
        if (currentBook) {
          const allHadiths = await getAllHadiths(currentCollection);
          const filteredHadiths = allHadiths
            .filter(h => h.bookNumber === currentBook)
            .map(h => h.hadithNumber);
          
          const uniqueHadiths = [...new Set(filteredHadiths)].sort((a, b) => 
            parseInt(a) - parseInt(b)
          );
          
          setHadithsInBook(uniqueHadiths);
        }
      } catch (error) {
        console.error("Failed to load hadiths in book:", error);
      }
    };
    
    loadHadithsInBook();
  }, [currentCollection, currentBook]);
  
  useEffect(() => {
    const loadTotalCount = async () => {
      try {
        const count = await getTotalHadithCount(currentCollection);
        setTotalHadiths(count);
        console.log(`Total hadiths loaded: ${count}`);
      } catch (error) {
        console.error("Failed to load total hadith count:", error);
      }
    };
    
    loadTotalCount();
  }, [currentCollection]);
  
  useEffect(() => {
    const updateCurrentIndex = async () => {
      if (hadithData) {
        try {
          const allHadiths = await getAllHadiths(currentCollection);
          const index = allHadiths.findIndex(
            h => h.bookNumber === hadithData.bookNumber && h.hadithNumber === hadithData.hadithNumber
          );
          
          if (index !== -1) {
            setCurrentIndex(index);
            setIsFirstHadith(index === 0);
            setIsLastHadith(index === totalHadiths - 1);
            console.log(`Current index: ${index}, isFirst: ${index === 0}, isLast: ${index === totalHadiths - 1}`);
          }
        } catch (error) {
          console.error("Error updating current index:", error);
        }
      }
    };
    
    if (hadithData) {
      updateCurrentIndex();
    }
  }, [hadithData, totalHadiths, currentCollection]);
  
  useEffect(() => {
    const loadHadithData = async () => {
      setIsLoading(true);
      setError(null);
      
      console.log(`⏳ Loading hadith data: collection=${currentCollection}, book=${currentBook}, hadith=${currentHadith}`);
      console.log(`Book Structure for debugging:`, BUKHARI_BOOK_STRUCTURE);
      
      try {
        // Verify if the current book and hadith combination exists in the structure
        const bookRange = BUKHARI_BOOK_STRUCTURE[currentBook];
        console.log(`Checking book range for book ${currentBook}:`, bookRange);
        
        if (bookRange) {
          const hadithNum = parseInt(currentHadith);
          console.log(`Checking if hadith ${hadithNum} is in range ${bookRange.start}-${bookRange.end}`);
          const isInRange = hadithNum >= bookRange.start && hadithNum <= bookRange.end;
          console.log(`Hadith ${hadithNum} is ${isInRange ? 'in' : 'NOT in'} range`);
          
          // If not in range, find the correct book and update
          if (!isInRange) {
            const correctBookNum = getBookFromHadithNumber(hadithNum);
            console.log(`Hadith ${hadithNum} should be in book ${correctBookNum}`);
            
            if (correctBookNum !== currentBook) {
              console.log(`Updating book from ${currentBook} to ${correctBookNum}`);
              setCurrentBook(correctBookNum);
              // Update URL to reflect correct book/hadith combination
              navigate(`/sunnah/reading?collection=${currentCollection}&book=${correctBookNum}&hadith=${currentHadith}`, { replace: true });
            }
          }
        }
        
        const hadith = await getHadith(currentCollection, currentBook, currentHadith);
        
        if (hadith) {
          console.log(`✅ Hadith loaded successfully:`, hadith);
          
          // If the hadith was found but in a different book, update the state to match
          if (hadith.bookNumber !== currentBook) {
            console.log(`Book number mismatch - URL shows book ${currentBook} but hadith is in book ${hadith.bookNumber}`);
            setCurrentBook(hadith.bookNumber);
            // Update URL to reflect correct book/hadith combination
            navigate(`/sunnah/reading?collection=${currentCollection}&book=${hadith.bookNumber}&hadith=${currentHadith}`, { replace: true });
          }
          
          setHadithData(hadith);
        } else {
          console.error(`❌ Hadith not found for: collection=${currentCollection}, book=${currentBook}, hadith=${currentHadith}`);
          throw new Error("Hadith not found");
        }
      } catch (error) {
        console.error("❌ Failed to load hadith data:", error);
        setError("Failed to load the hadith data. Please try again.");
        toast({
          title: "Error Loading Hadith",
          description: "Failed to load the hadith data. Please try again or check the console for more details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHadithData();
  }, [currentBook, currentHadith, toast, navigate]);
  
  useEffect(() => {
    const loadCollectionsList = async () => {
      try {
        const collectionsList = await listCollections();
        setCollections(collectionsList);
      } catch (error) {
        console.error("Failed to load collections list:", error);
      }
    };
    
    loadCollectionsList();
  }, []);
  
  useEffect(() => {
    console.log(`Props updated: initialCollection=${initialCollection}, initialBook=${initialBook}, initialHadith=${initialHadith}`);
    
    setCurrentCollection(initialCollection);
    if (initialBook && initialHadith) {
      setCurrentBook(initialBook);
      setCurrentHadith(initialHadith);
    }
  }, [initialCollection, initialBook, initialHadith]);
  
  useEffect(() => {
    let hadiths: string[] = [];
    
    if (selectedBookForSubmenu) {
      hadiths = getFilteredHadithsForBook(selectedBookForSubmenu);
    } else if (selectedCategory) {
      hadiths = getFilteredHadithsForCategory();
    } else {
      return;
    }
    
    // Create sub-ranges for pagination if there are more than 50 hadiths
    if (hadiths.length > 50) {
      const ranges: number[][] = [];
      const rangeSize = 50;
      
      for (let i = 0; i < hadiths.length; i += rangeSize) {
        const start = parseInt(hadiths[i]);
        const end = i + rangeSize < hadiths.length 
          ? parseInt(hadiths[i + rangeSize - 1]) 
          : parseInt(hadiths[hadiths.length - 1]);
        
        ranges.push([start, end]);
      }
      
      setHadithSubRanges(ranges);
      setActiveSubRange(0);
    } else {
      setHadithSubRanges([]);
    }
  }, [selectedBookForSubmenu, selectedCategory, hadithFilter]);
  
  const handleNextHadith = async () => {
    if (isLoading || !hadithData || isLastHadith) return;
    
    try {
      setIsLoading(true);
      const nextIndex = currentIndex + 1;
      
      if (nextIndex >= totalHadiths) {
        setIsLoading(false);
        return;
      }
      
      const nextHadith = await getHadithByIndex(currentCollection, nextIndex);
      
      if (nextHadith) {
        setCurrentHadith(nextHadith.hadithNumber);
        setCurrentBook(nextHadith.bookNumber);
        navigate(`/sunnah/reading?collection=${currentCollection}&book=${nextHadith.bookNumber}&hadith=${nextHadith.hadithNumber}`, { replace: true });
      }
    } catch (error) {
      console.error("Error getting next hadith:", error);
      toast({
        title: "Error",
        description: "Could not load the next hadith.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const handlePreviousHadith = async () => {
    if (isLoading || !hadithData || isFirstHadith) return;
    
    try {
      setIsLoading(true);
      const prevIndex = currentIndex - 1;
      
      if (prevIndex < 0) {
        setIsLoading(false);
        return;
      }
      
      const prevHadith = await getHadithByIndex(currentCollection, prevIndex);
      
      if (prevHadith) {
        setCurrentHadith(prevHadith.hadithNumber);
        setCurrentBook(prevHadith.bookNumber);
        navigate(`/sunnah/reading?collection=${currentCollection}&book=${prevHadith.bookNumber}&hadith=${prevHadith.hadithNumber}`, { replace: true });
      }
    } catch (error) {
      console.error("Error getting previous hadith:", error);
      toast({
        title: "Error",
        description: "Could not load the previous hadith.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const handleRandomHadith = async () => {
    if (isLoading || !hadithData) return;
    
    try {
      const randomIndex = Math.floor(Math.random() * totalHadiths);
      const randomHadith = await getHadithByIndex(currentCollection, randomIndex);
      
      if (randomHadith) {
        setCurrentHadith(randomHadith.hadithNumber);
        setCurrentBook(randomHadith.bookNumber);
        navigate(`/sunnah/reading?collection=${currentCollection}&book=${randomHadith.bookNumber}&hadith=${randomHadith.hadithNumber}`, { replace: true });
      }
    } catch (error) {
      console.error("Error getting random hadith:", error);
      toast({
        title: "Error",
        description: "Could not load a random hadith.",
        variant: "destructive",
      });
    }
  };

  const handleBookChange = (value: string) => {
    setCurrentBook(value);
    if (hadithsInBook.length > 0) {
      navigate(`/sunnah/reading?collection=${currentCollection}&book=${value}&hadith=${hadithsInBook[0]}`, { replace: true });
    } else {
      navigate(`/sunnah/reading?collection=${currentCollection}&book=${value}&hadith=1`, { replace: true });
    }
  };
  
  const handleHadithChange = (value: string) => {
    setCurrentHadith(value);
    navigate(`/sunnah/reading?collection=${currentCollection}&book=${currentBook}&hadith=${value}`, { replace: true });
  };

  const returnToSearchResults = () => {
    console.log("Returning to search results with:", {
      query: searchQuery,
      resultsCount: searchResults.length,
      scrollPosition
    });
    
    navigate('/sunnah/explore', { 
      state: { 
        preserveSearch: true,
        lastQuery: searchQuery,
        results: searchResults,
        scrollPosition: scrollPosition
      } 
    });
  };
  
  const getCurrentBookName = (bookNum: string) => {
    const range = BUKHARI_BOOK_STRUCTURE[bookNum];
    return range?.name || `Book ${bookNum}`;
  };
  
  // Function to generate array of hadith numbers for a book
  const getHadithsForBook = (bookNum: string): string[] => {
    const range = BUKHARI_BOOK_STRUCTURE[bookNum];
    if (!range) return [];
    
    const hadiths: string[] = [];
    for (let i = range.start; i <= range.end; i++) {
      hadiths.push(i.toString());
    }
    return hadiths;
  };
  
  // Function to filter hadiths by search term
  const getFilteredHadithsForBook = (bookNum: string): string[] => {
    const allHadiths = getHadithsForBook(bookNum);
    if (!hadithFilter) return allHadiths;
    
    return allHadiths.filter(hadith => 
      hadith.includes(hadithFilter)
    );
  };
  
  // Function to generate array of hadith numbers for a category range
  const getHadithsForCategory = (category: { start: number; end: number }): string[] => {
    if (!category) return [];
    
    const hadiths: string[] = [];
    for (let i = category.start; i <= category.end; i++) {
      hadiths.push(i.toString());
    }
    return hadiths;
  };
  
  // Function to filter hadiths by search term
  const getFilteredHadithsForCategory = (): string[] => {
    if (!selectedCategory) return [];
    const allHadiths = getHadithsForCategory(selectedCategory.category);
    if (!hadithFilter) return allHadiths;
    
    return allHadiths.filter(hadith => 
      hadith.includes(hadithFilter)
    );
  };
  
  if (isLoading) {
    return (
      <div className="glass-card rounded-lg p-6 animate-pulse-subtle">
        <div className="h-10 w-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
        <p className="text-center text-app-text-secondary">Loading hadith...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="glass-card rounded-lg p-6">
        <div className="text-red-500 mb-4 text-center">⚠️ {error}</div>
        <div className="text-app-text-secondary mb-4 text-sm text-center">
          Collection: {currentCollection}, Book: {currentBook}, Hadith: {currentHadith}
        </div>
        <div className="flex justify-center gap-2">
          <Button 
            onClick={() => {
              setError(null);
              setCurrentBook("1");
              setCurrentHadith("1");
              navigate(`/sunnah/reading?collection=${currentCollection}&book=1&hadith=1`, { replace: true });
            }}
            variant="default"
            className="bg-teal-500 hover:bg-teal-600 text-app-background-dark"
          >
            Try Default Hadith
          </Button>
          
          <Button 
            onClick={() => {
              setError(null);
              const hadithData = async () => {
                setIsLoading(true);
                try {
                  const hadith = await getHadith(currentCollection, currentBook, currentHadith);
                  if (hadith) {
                    setHadithData(hadith);
                    setIsLoading(false);
                  } else {
                    throw new Error("Hadith still not found");
                  }
                } catch (retryError) {
                  console.error("Failed retry:", retryError);
                  setError("Failed to load after retry. Please try another hadith.");
                  setIsLoading(false);
                }
              };
              hadithData();
            }}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-8", className)}>
      {fromSearch && (
        <div className="px-6 mb-4">
          <Button 
            variant="link" 
            className="flex items-center justify-center text-teal-500 p-0 h-auto font-normal"
            onClick={returnToSearchResults}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to search results for "{searchQuery}"
          </Button>
        </div>
      )}
      
      <div className="px-6 mb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="h-14 px-6 py-4 bg-gradient-to-r from-slate-800/80 via-slate-800/60 to-slate-800/80 border border-slate-700 rounded-md flex items-center justify-center text-lg font-medium text-white shadow-inner flex-1">
            {hadithData ? getHadithCategory(hadithData.hadithNumber, "bukhari") : "Loading..."}
          </div>

          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white" onClick={() => setDrawerOpen(true)}>
                <BookOpen className="h-4 w-4 mr-2" />
                Browse
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-app-background border-t border-slate-700">
              <div className="mx-auto w-full max-w-4xl">
                <DrawerHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <DrawerTitle className="text-white">
                        {selectedCategory 
                          ? selectedCategory.category.name 
                          : selectedBookForSubmenu 
                            ? `Book ${selectedBookForSubmenu}: ${getCurrentBookName(selectedBookForSubmenu)}`
                            : "Browse Sahih Bukhari"}
                      </DrawerTitle>
                      <DrawerDescription className="text-app-text-secondary">
                        {selectedCategory 
                          ? `Hadiths ${selectedCategory.category.start} - ${selectedCategory.category.end}` 
                          : selectedBookForSubmenu
                            ? `Hadiths ${BUKHARI_BOOK_STRUCTURE[selectedBookForSubmenu]?.start} - ${BUKHARI_BOOK_STRUCTURE[selectedBookForSubmenu]?.end}`
                            : `${TOTAL_HADITHS} authentic hadiths across ${TOTAL_BOOKS} books`}
                      </DrawerDescription>
                    </div>
                    <DrawerClose asChild>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-slate-800 hover:text-white">
                        <X className="h-4 w-4" />
                      </Button>
                    </DrawerClose>
                  </div>
                </DrawerHeader>
                
                <div className="px-4 py-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder={
                        selectedCategory || selectedBookForSubmenu 
                          ? "Filter hadith numbers..." 
                          : "Search by book name or number..."
                      }
                      className="bg-slate-800 border-slate-700 text-white pl-10 transition-all duration-300"
                      value={hadithFilter}
                      onChange={(e) => setHadithFilter(e.target.value)}
                    />
                    {hadithFilter && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400 hover:text-white" 
                        onClick={() => setHadithFilter("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="h-[60vh] px-4 overflow-hidden">
                  {selectedCategory ? (
                    <div className="animate-in fade-in slide-in-from-right duration-300 space-y-4">
                      <div className="flex items-center justify-between">
                        <Button 
                          variant="ghost" 
                          className="text-white hover:bg-slate-800 px-2 flex items-center"
                          onClick={() => {
                            setSelectedCategory(null);
                            setHadithFilter("");
                          }}
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Back to Categories
                        </Button>
                      </div>
                      
                      <ScrollArea className="h-[50vh] pr-2">
                        <div className="grid grid-cols-5 gap-2">
                          {getFilteredHadithsForCategory()
                            .filter(hadithNum => {
                              if (hadithSubRanges.length > 0) {
                                const num = parseInt(hadithNum);
                                const [start, end] = hadithSubRanges[activeSubRange];
                                return num >= start && num <= end;
                              }
                              return true;
                            })
                            .map(hadithNum => (
                              <Button
                                key={hadithNum}
                                variant={hadithNum === currentHadith ? "default" : "outline"}
                                className={`
                                  ${hadithNum === currentHadith 
                                    ? "bg-teal-500 hover:bg-teal-600 text-slate-900" 
                                    : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"}
                                  transition-all duration-200 hover:scale-105
                                `}
                                onClick={() => {
                                  const bookNum = getBookFromHadithNumber(parseInt(hadithNum));
                                  setCurrentHadith(hadithNum);
                                  setCurrentBook(bookNum);
                                  setDrawerOpen(false);
                                  navigate(`/sunnah/reading?collection=${currentCollection}&book=${bookNum}&hadith=${hadithNum}`, { replace: true });
                                }}
                              >
                                {hadithNum}
                              </Button>
                            ))}
                        </div>
                        
                        {getFilteredHadithsForCategory().length === 0 && (
                          <div className="py-8 text-center text-app-text-secondary">
                            No hadiths match your filter
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  ) : selectedBookForSubmenu ? (
                    <div className="animate-in fade-in slide-in-from-right duration-300 space-y-4">
                      <div className="flex items-center justify-between">
                        <Button 
                          variant="ghost" 
                          className="text-white hover:bg-slate-800 px-2 flex items-center"
                          onClick={() => {
                            setSelectedBookForSubmenu(null);
                            setHadithFilter("");
                          }}
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Back to Books
                        </Button>
                      </div>
                      
                      <ScrollArea className="h-[50vh] pr-2">
                        <div className="grid grid-cols-5 gap-2">
                          {getFilteredHadithsForBook(selectedBookForSubmenu)
                            .map(hadithNum => (
                              <Button
                                key={hadithNum}
                                variant={hadithNum === currentHadith ? "default" : "outline"}
                                className={`
                                  ${hadithNum === currentHadith 
                                    ? "bg-teal-500 hover:bg-teal-600 text-slate-900" 
                                    : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"}
                                  transition-all duration-200 hover:scale-105
                                `}
                                onClick={() => {
                                  setCurrentHadith(hadithNum);
                                  setCurrentBook(selectedBookForSubmenu);
                                  setDrawerOpen(false);
                                  navigate(`/sunnah/reading?collection=${currentCollection}&book=${selectedBookForSubmenu}&hadith=${hadithNum}`, { replace: true });
                                }}
                              >
                                {hadithNum}
                              </Button>
                            ))}
                        </div>
                        
                        {getFilteredHadithsForBook(selectedBookForSubmenu).length === 0 && (
                          <div className="py-8 text-center text-app-text-secondary">
                            No hadiths match your filter
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-left duration-300 py-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-3">
                          <h3 className="text-white font-medium px-1">Books</h3>
                          <ScrollArea className="h-[48vh] pr-2">
                            <div className="space-y-2">
                              {Object.entries(BUKHARI_BOOK_STRUCTURE)
                                .filter(([bookId, book]) => 
                                  !hadithFilter || 
                                  bookId.includes(hadithFilter) || 
                                  book.name.toLowerCase().includes(hadithFilter.toLowerCase())
                                )
                                .map(([bookId, book]) => (
                                  <Button
                                    key={bookId}
                                    variant={currentBook === bookId ? "default" : "outline"}
                                    className={`
                                      ${currentBook === bookId
                                        ? "bg-teal-500 hover:bg-teal-600 text-slate-900" 
                                        : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"}
                                      justify-between h-auto py-3 w-full text-left flex-col items-start px-4
                                      transition-all duration-200 hover:scale-[1.02] hover:shadow-lg
                                    `}
                                    onClick={() => {
                                      setSelectedBookForSubmenu(bookId);
                                      setHadithFilter("");
                                    }}
                                  >
                                    <div className="flex w-full justify-between items-center">
                                      <span className="font-medium">Book {bookId}</span>
                                      <span className="text-xs bg-teal-500/20 text-teal-400 px-2 py-1 rounded-full">
                                        {book.end - book.start + 1} hadith{book.end - book.start !== 0 ? 's' : ''}
                                      </span>
                                    </div>
                                    <div className="text-xs text-slate-400 text-left mt-1 truncate w-full">
                                      {book.name}
                                    </div>
                                  </Button>
                                ))}
                              
                              {Object.entries(BUKHARI_BOOK_STRUCTURE).filter(([bookId, book]) => 
                                !hadithFilter || 
                                bookId.includes(hadithFilter) || 
                                book.name.toLowerCase().includes(hadithFilter.toLowerCase())
                              ).length === 0 && (
                                <div className="py-8 text-center text-app-text-secondary">
                                  No books match your filter
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-white font-medium px-1">Categories</h3>
                          <ScrollArea className="h-[48vh] pr-2">
                            <div className="space-y-2">
                              {Object.entries(BUKHARI_CATEGORIES)
                                .filter(([key, category]) => 
                                  !hadithFilter || 
                                  category.name.toLowerCase().includes(hadithFilter.toLowerCase())
                                )
                                .map(([key, category]) => (
                                  <Button
                                    key={key}
                                    variant="outline"
                                    className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700
                                      justify-between h-auto py-3 w-full text-left flex-col items-start px-4
                                      transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                                    onClick={() => {
                                      setSelectedCategory({ key, category });
                                      setHadithFilter("");
                                    }}
                                  >
                                    <div className="flex w-full justify-between items-center">
                                      <span className="font-medium">{category.name}</span>
                                      <span className="text-xs bg-teal-500/20 text-teal-400 px-2 py-1 rounded-full">
                                        {category.end - category.start + 1} hadith{category.end - category.start !== 0 ? 's' : ''}
                                      </span>
                                    </div>
                                    <div className="text-xs text-slate-400 text-left mt-1">
                                      Hadiths {category.start}-{category.end}
                                    </div>
                                  </Button>
                                ))}
                              
                              {Object.entries(BUKHARI_CATEGORIES).filter(([key, category]) => 
                                !hadithFilter || 
                                category.name.toLowerCase().includes(hadithFilter.toLowerCase())
                              ).length === 0 && (
                                <div className="py-8 text-center text-app-text-secondary">
                                  No categories match your filter
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button className="bg-teal-500 hover:bg-teal-600 text-slate-900 transition-all duration-200 hover:scale-[1.02]">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
      
      {hadithData && (
        <div className="px-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-app-text-secondary text-sm">
              Book {currentBook} • Hadith {currentHadith}
            </div>
            <div className="text-app-text-secondary text-sm">
              {currentIndex + 1} of {totalHadiths}
            </div>
          </div>
          
          <HadithCard 
            hadith={hadithData}
            onClick={() => {}}
            showBookmark={true}
            showShare={true}
            isExpanded={true}
          />
        </div>
      )}
      
      <div className="flex flex-col space-y-4 px-6 mt-6">
        <div className="grid grid-cols-5 gap-2">
          <Button 
            onClick={() => {
              handlePreviousHadith();
              handlePreviousHadith();
              handlePreviousHadith();
              handlePreviousHadith();
              handlePreviousHadith();
            }}
            disabled={isFirstHadith || isLoading}
            variant="outline"
            size="icon"
            className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button 
          onClick={handlePreviousHadith}
          disabled={isFirstHadith || isLoading}
            variant="outline"
            className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        
        <Button
          onClick={handleRandomHadith}
          disabled={isLoading}
            variant="default"
            className="bg-teal-500 hover:bg-teal-600 text-slate-900 disabled:opacity-40 disabled:pointer-events-none"
        >
            <Shuffle className="h-4 w-4 mr-2" /> Random
        </Button>
        
          <Button 
          onClick={handleNextHadith}
          disabled={isLastHadith || isLoading}
            variant="outline"
            className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
          
          <Button 
            onClick={() => {
              handleNextHadith();
              handleNextHadith();
              handleNextHadith();
              handleNextHadith();
              handleNextHadith();
            }}
            disabled={isLastHadith || isLoading}
            variant="outline"
            size="icon"
            className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative w-full rounded-full h-1 bg-slate-800 overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-teal-400" 
            style={{ width: `${(currentIndex / (totalHadiths - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
