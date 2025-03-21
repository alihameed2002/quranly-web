// Define the category structure for Sahih Bukhari hadiths
export const bukhariCategories = [
  { id: "1", name: "Revelation (Kitab Al-Wahi)", range: [1, 7] },
  { id: "2", name: "Belief (Kitab Al-Iman)", range: [8, 58] },
  { id: "3", name: "Knowledge (Kitab Al-Ilm)", range: [59, 134] },
  { id: "4", name: "Ablutions (Wudu') (Kitab Al-Wudu')", range: [135, 247] },
  { id: "5", name: "Bathing (Ghusl) (Kitab Al-Ghusl)", range: [248, 292] },
  { id: "6", name: "Menstrual Periods (Kitab Al-Haid)", range: [293, 333] },
  { id: "7", name: "Rubbing Hands and Feet with Dust (Tayammum) (Kitab At-Tayammum)", range: [334, 348] },
  { id: "8", name: "Prayers (Salat) (Kitab As-Salat)", range: [349, 520] },
  { id: "9", name: "Times of the Prayers (Kitab Mawaqit As-Salat)", range: [521, 602] },
  { id: "10", name: "Call to Prayers (Adhan) (Kitab Al-Adhan)", range: [603, 875] },
  { id: "11", name: "Friday Prayer (Kitab Al-Jumu'ah)", range: [876, 941] },
  { id: "12", name: "Fear Prayer (Kitab Salat Al-Khawf)", range: [942, 947] },
  { id: "13", name: "The Two Festivals (Eids) (Kitab Al-Idayn)", range: [948, 989] },
  { id: "14", name: "Witr Prayer (Kitab Al-Witr)", range: [990, 1004] },
  { id: "15", name: "Invoking Allah for Rain (Istisqa) (Kitab Al-Istisqa)", range: [1005, 1039] },
  { id: "16", name: "Eclipses (Kitab Al-Kusuf)", range: [1040, 1066] },
  { id: "17", name: "Prostration During Recital of Quran (Kitab Sujud Al-Quran)", range: [1067, 1079] },
  { id: "18", name: "Shortening the Prayers (At-Taqseer) (Kitab At-Taqseer)", range: [1080, 1119] },
  { id: "19", name: "Prayer at Night (Tahajjud) (Kitab At-Tahajjud)", range: [1120, 1187] },
  { id: "20", name: "Virtues of Prayer in Makkah and Madinah (Kitab Fadl As-Salat fi Masjid Makkah wa Madinah)", range: [1188, 1197] },
  { id: "21", name: "Actions While Praying (Kitab Al-Amal fi As-Salat)", range: [1198, 1223] },
  { id: "22", name: "Forgetfulness in Prayer (Kitab As-Sahw)", range: [1224, 1236] },
  { id: "23", name: "Funerals (Al-Jana'iz) (Kitab Al-Jana'iz)", range: [1237, 1394] },
  { id: "24", name: "Obligatory Charity Tax (Zakat) (Kitab Az-Zakat)", range: [1395, 1512] },
  { id: "25", name: "Hajj (Pilgrimage) (Kitab Al-Hajj)", range: [1513, 1772] },
  { id: "26", name: "Umrah (Minor Pilgrimage) (Kitab Al-Umrah)", range: [1773, 1805] },
  { id: "27", name: "Pilgrims Prevented from Completing Hajj (Kitab Al-Muhsar)", range: [1806, 1820] },
  { id: "28", name: "Penalty of Hunting While on Pilgrimage (Kitab Jazaa As-Said)", range: [1821, 1866] },
  { id: "29", name: "Virtues of Madinah (Kitab Fada'il Al-Madinah)", range: [1867, 1890] },
  { id: "30", name: "Fasting (Kitab As-Sawm)", range: [1891, 2007] },
  { id: "31", name: "Praying at Night in Ramadan (Taraweeh) (Kitab Salat At-Tarawih)", range: [2008, 2013] },
  { id: "32", name: "Virtues of the Night of Qadr (Kitab Fadl Lailat Al-Qadr)", range: [2014, 2024] },
  { id: "33", name: "Retreat (I'tikaf) (Kitab Al-I'tikaf)", range: [2025, 2046] },
  { id: "34", name: "Sales and Trade (Kitab Al-Buyu)", range: [2047, 2238] },
  { id: "35", name: "Sales in Which a Price is Paid Later (Salam) (Kitab As-Salam)", range: [2239, 2256] },
  { id: "36", name: "Pre-emption (Shuf'a) (Kitab Ash-Shuf'a)", range: [2257, 2259] },
  { id: "37", name: "Hiring (Kitab Al-Ijarah)", range: [2260, 2286] },
  { id: "38", name: "Transfer of Debt (Hawala) (Kitab Al-Hawala)", range: [2287, 2289] },
  { id: "39", name: "Representation or Agency (Wakala) (Kitab Al-Wakala)", range: [2290, 2319] },
  { id: "40", name: "Agriculture (Kitab Al-Muzara'a)", range: [2320, 2350] },
  { id: "41", name: "Watering (Kitab Al-Musaaqa)", range: [2351, 2383] },
  { id: "42", name: "Loans, Payment of Loans, Freezing of Property, Bankruptcy (Kitab Al-Istikrad)", range: [2384, 2409] },
  { id: "43", name: "Lost Things Picked Up by Someone (Luqata) (Kitab Al-Luqata)", range: [2410, 2439] },
  { id: "44", name: "Oppressions (Kitab Al-Mazalim)", range: [2440, 2482] },
  { id: "45", name: "Partnership (Kitab Ash-Shirka)", range: [2483, 2507] },
  { id: "46", name: "Pledging (Kitab Ar-Rahn)", range: [2508, 2515] },
  { id: "47", name: "Manumission of Slaves (Kitab Al-Itq)", range: [2516, 2559] },
  { id: "48", name: "Gifts (Kitab Al-Hibat)", range: [2560, 2636] },
  { id: "49", name: "Witnesses (Kitab Ash-Shahadat)", range: [2637, 2689] },
  { id: "50", name: "Peacemaking (Kitab As-Sulh)", range: [2690, 2707] },
  { id: "51", name: "Conditions (Kitab Ash-Shurut)", range: [2708, 2737] },
  { id: "52", name: "Wills and Testaments (Wasaayaa) (Kitab Al-Wasaayaa)", range: [2738, 2781] },
  { id: "53", name: "Fighting for the Cause of Allah (Jihaad) (Kitab Al-Jihad)", range: [2782, 3090] },
  { id: "54", name: "One-fifth of Booty to the Cause of Allah (Khums) (Kitab Al-Khums)", range: [3091, 3155] },
  { id: "55", name: "Jizyah and Mawaada'ah (Kitab Al-Jizya)", range: [3156, 3189] },
  { id: "56", name: "Beginning of Creation (Kitab Bad' Al-Khalq)", range: [3190, 3325] },
  { id: "57", name: "Prophets (Kitab Ahadith Al-Anbiya)", range: [3326, 3488] },
  { id: "58", name: "Virtues and Merits of the Prophet and His Companions (Kitab Al-Fada'il)", range: [3489, 3775] },
  { id: "59", name: "Companions of the Prophet (Kitab Fada'il Ashab An-Nabi)", range: [3776, 3896] },
  { id: "60", name: "Merits of Sunnah (Kitab Al-I'tisam)", range: [3897, 3913] },
  { id: "61", name: "Military Expeditions Led by the Prophet (Kitab Al-Maghaazi)", range: [3914, 4473] },
  { id: "62", name: "Commentary on the Quran (Kitab At-Tafsir)", range: [4474, 4977] },
  { id: "63", name: "Virtues of the Quran (Kitab Fada'il Al-Quran)", range: [4978, 5107] },
  { id: "64", name: "Marriage (Kitab An-Nikah)", range: [5108, 5250] },
  { id: "65", name: "Divorce (Kitab At-Talaq)", range: [5251, 5332] },
  { id: "66", name: "Supporting the Family (Kitab An-Nafaqat)", range: [5333, 5364] },
  { id: "67", name: "Food, Meals (Kitab Al-At'ima)", range: [5365, 5466] },
  { id: "68", name: "Sacrifice on Occasion of Birth (Aqiqa) (Kitab Al-Aqiqa)", range: [5467, 5474] },
  { id: "69", name: "Slaughtering and Hunting (Kitab Adh-Dhaba'ih)", range: [5475, 5569] },
  { id: "70", name: "Al-Adahi (Sacrifices) (Kitab Al-Adahi)", range: [5570, 5614] },
  { id: "71", name: "Drinks (Kitab Al-Ashriba)", range: [5615, 5639] },
  { id: "72", name: "Patients (Kitab Al-Marda)", range: [5640, 5678] },
  { id: "73", name: "Medicine (Kitab At-Tibb)", range: [5679, 5769] },
  { id: "74", name: "Dress (Kitab Al-Libas)", range: [5770, 5878] },
  { id: "75", name: "Good Manners and Form (Al-Adab) (Kitab Al-Adab)", range: [5879, 6226] },
  { id: "76", name: "Asking Permission (Kitab Al-Isti'dhan)", range: [6227, 6303] },
  { id: "77", name: "Invocations (Kitab Ad-Da'awat)", range: [6304, 6411] },
  { id: "78", name: "Softening of Hearts (Kitab Ar-Riqaq)", range: [6412, 6593] },
  { id: "79", name: "Divine Will (Qadar) (Kitab Al-Qadar)", range: [6594, 6620] },
  { id: "80", name: "Oaths and Vows (Kitab Al-Ayman wa An-Nudhur)", range: [6621, 6707] },
  { id: "81", name: "Expiation for Unfulfilled Oaths (Kitab Kafarat Al-Ayman)", range: [6708, 6726] },
  { id: "82", name: "Laws of Inheritance (Kitab Al-Fara'id)", range: [6727, 6771] },
  { id: "83", name: "Limits and Punishments Set by Allah (Hudood) (Kitab Al-Hudud)", range: [6772, 6860] },
  { id: "84", name: "Blood Money (Ad-Diyat) (Kitab Ad-Diyat)", range: [6861, 6917] },
  { id: "85", name: "Apostates (Kitab Al-Murtaddin)", range: [6918, 6925] },
  { id: "86", name: "Coercion (Kitab Al-Ikrah)", range: [6926, 6952] },
  { id: "87", name: "Tricks (Kitab Al-Hiyal)", range: [6953, 6981] },
  { id: "88", name: "Interpretation of Dreams (Kitab Ta'bir Ar-Ru'ya)", range: [6982, 7047] },
  { id: "89", name: "Afflictions and the End of the World (Kitab Al-Fitan)", range: [7048, 7136] },
  { id: "90", name: "Judgments (Ahkaam) (Kitab Al-Ahkaam)", range: [7137, 7225] },
  { id: "91", name: "Wishes (Kitab At-Tamanni)", range: [7226, 7245] },
  { id: "92", name: "Accepting Information Given by a Truthful Person (Kitab Qabul Al-Akhbar)", range: [7246, 7268] },
  { id: "93", name: "Holding Fast to the Quran and Sunnah (Kitab Al-I'tisam Bil-Kitab wa As-Sunnah)", range: [7269, 7370] },
  { id: "94", name: "Oneness of Allah (Tawheed) (Kitab At-Tawheed)", range: [7371, 7563] }
];

// Helper function to find the category for a given hadith number
export function findBukhariCategory(hadithNumber: number): { id: string; name: string } | null {
  const category = bukhariCategories.find(
    cat => hadithNumber >= cat.range[0] && hadithNumber <= cat.range[1]
  );
  
  if (!category) return null;
  
  return {
    id: category.id,
    name: category.name
  };
} 