
export interface Verse {
  id: number;
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
}

export interface Surah {
  id: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

// Placeholder data for demo purposes
export const sampleVerse: Verse = {
  id: 1,
  surah: 7,
  ayah: 128,
  arabic: "قَالَ مُوسَىٰ لِقَوْمِهِ اسْتَعِينُوا بِاللَّهِ وَاصْبِرُوا ۖ إِنَّ الْأَرْضَ لِلَّهِ يُورِثُهَا مَن يَشَاءُ مِنْ عِبَادِهِ ۖ وَالْعَاقِبَةُ لِلْمُتَّقِينَ",
  translation: "Moses reassured his people, \"Seek Allah's help and be patient. Indeed, the earth belongs to Allah (alone). He grants it to whoever He chooses of His servants. The ultimate outcome belongs (only) to the righteous.\""
};

export const sampleSurah: Surah = {
  id: 7,
  name: "Al-Araf",
  englishName: "The Heights",
  englishNameTranslation: "The Heights",
  numberOfAyahs: 206,
  revelationType: "Meccan"
};

// Placeholder for API calls
export const fetchQuranData = async () => {
  // This would be replaced with actual API calls
  console.log("Fetching Quran data...");
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    surah: sampleSurah,
    verse: sampleVerse
  };
};

export const fetchSurahs = async (): Promise<Surah[]> => {
  // This would fetch the list of all surahs
  console.log("Fetching surah list...");
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return just the sample surah for demo
  return [sampleSurah];
};
