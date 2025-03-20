// Define categories for the Quran surahs
export const QURAN_CATEGORIES = {
  "The Opening and Cow": [1, 2],
  "Family of Imran to Women": [3, 4], 
  "The Table Spread to The Heights": [5, 6, 7],
  "The Spoils of War to Repentance": [8, 9],
  "Jonah to Abraham": [10, 11, 12, 13, 14],
  "The Rocky Tract to The Bee": [15, 16],
  "The Night Journey to The Prophets": [17, 18, 19, 20, 21],
  "The Pilgrimage to The Criterion": [22, 23, 24, 25],
  "The Poets to The Romans": [26, 27, 28, 29, 30],
  "Luqman to Prostration": [31, 32],
  "The Combined Forces to Originator": [33, 34, 35],
  "Ya Sin to The Troops": [36, 37, 38, 39],
  "The Forgiver to Consultation": [40, 41, 42],
  "Ornaments of Gold to Kneeling": [43, 44, 45],
  "The Wind-Curved Sandhills to Victory": [46, 47, 48],
  "The Rooms to The Mount": [49, 50, 51, 52],
  "The Star to The Inevitable": [53, 54, 55, 56],
  "Iron to The Gathering": [57, 58, 59],
  "She Who Disputes to Banning": [60, 61, 62, 63, 64, 65, 66],
  "The Sovereignty to The Pen": [67, 68],
  "The Reality to The Jinn": [69, 70, 71, 72],
  "The Enshrouded One to The Cloaked One": [73, 74],
  "The Rising of the Dead to Man": [75, 76],
  "The Emissaries to Those Who Pull Out": [77, 78, 79],
  "He Frowned to The Cleaving": [80, 81, 82],
  "The Defrauding to The Morning Hours": [83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93],
  "The Relief to The Clear Proof": [94, 95, 96, 97, 98],
  "The Earthquake to People": [99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114]
};

// Define Juz divisions (30 parts of the Quran) - used for alternative categorization
export const JUZ_DIVISIONS = [
  { juz: 1, startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141, name: "Alif Lam Meem" },
  { juz: 2, startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252, name: "Sayaqūl" },
  { juz: 3, startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92, name: "Tilka 'r-Rusul" },
  { juz: 4, startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23, name: "Lan Tanaloo" },
  { juz: 5, startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147, name: "Wa'l-Muhsanaat" },
  { juz: 6, startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81, name: "La Yuhibbu 'l-Lah" },
  { juz: 7, startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110, name: "Wa Idha Samiu" },
  { juz: 8, startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87, name: "Wa Law Annana" },
  { juz: 9, startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40, name: "Qala 'l-Mala" },
  { juz: 10, startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92, name: "Wa'ilamoo" },
  { juz: 11, startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5, name: "Yatadhiroon" },
  { juz: 12, startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52, name: "Wa Mamin Dabbah" },
  { juz: 13, startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52, name: "Wa Ma Ubarri'u" },
  { juz: 14, startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128, name: "Rubama" },
  { juz: 15, startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74, name: "Subhana 'Ladhi" },
  { juz: 16, startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135, name: "Qal Alam" },
  { juz: 17, startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78, name: "Iqtaraba Li'n-Nas" },
  { juz: 18, startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20, name: "Qad Aflaha" },
  { juz: 19, startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55, name: "Wa Qala 'Ladhina" },
  { juz: 20, startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45, name: "A'man Khalaqa" },
  { juz: 21, startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30, name: "Utlu Ma Oohi" },
  { juz: 22, startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27, name: "Wa Man Yaqnut" },
  { juz: 23, startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31, name: "Wa Ma Liya" },
  { juz: 24, startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46, name: "Fa Man Azlam" },
  { juz: 25, startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37, name: "Ilayhi Yuraddu" },
  { juz: 26, startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30, name: "Ha Meem" },
  { juz: 27, startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29, name: "Qala Fa Ma Khatbukum" },
  { juz: 28, startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12, name: "Qad Sami'a Allah" },
  { juz: 29, startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50, name: "Tabaraka 'Ladhi" },
  { juz: 30, startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6, name: "Amma" }
];

// Group surahs by revelation type
export const REVELATION_TYPES = {
  "Meccan": [1, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 55, 56, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 111, 112, 113, 114],
  "Medinan": [2, 3, 4, 5, 8, 9, 22, 24, 33, 47, 48, 49, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 98, 99, 110]
};

// Surah group by length (classified by verse count)
export const SURAH_LENGTH = {
  "Very Long (over 200 verses)": [2, 3, 4, 7, 26],
  "Long (100-200 verses)": [6, 9, 10, 11, 12, 16, 17, 18, 20, 21, 23, 24, 25, 27, 28, 37],
  "Medium (50-99 verses)": [5, 8, 13, 14, 15, 19, 22, 29, 30, 33, 34, 35, 36, 38, 39, 40, 41, 43, 44, 46, 47, 51, 56],
  "Short (20-49 verses)": [31, 32, 42, 45, 48, 49, 50, 52, 53, 54, 55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 75, 76, 77],
  "Very Short (under 20 verses)": [1, 73, 74, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114]
};

// Define detailed information for each surah as reference
export const QURAN_SURAHS = [
  { id: 1, name: "Al-Fatiha", englishName: "The Opening", verses: 7, revelationType: "Meccan", startJuz: 1 },
  { id: 2, name: "Al-Baqarah", englishName: "The Cow", verses: 286, revelationType: "Medinan", startJuz: 1 },
  { id: 3, name: "Aal-Imran", englishName: "The Family of Imran", verses: 200, revelationType: "Medinan", startJuz: 3 },
  { id: 4, name: "An-Nisa", englishName: "The Women", verses: 176, revelationType: "Medinan", startJuz: 4 },
  { id: 5, name: "Al-Ma'idah", englishName: "The Table Spread", verses: 120, revelationType: "Medinan", startJuz: 6 },
  // Add more as needed - removed for brevity
]; 