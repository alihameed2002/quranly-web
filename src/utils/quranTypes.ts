
// Common types for Quran data
export interface Verse {
  id: number;
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
  surahName?: string;
  totalVerses?: number;
}

export interface Surah {
  id: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

// Interface for Quran.com API format
export interface QuranComVerse {
  id: number;
  verse_key: string;
  text_uthmani: string;
  translations: {
    id: number;
    text: string;
  }[];
}

// Sample data for testing and fallback
export const sampleVerse: Verse = {
  id: 1,
  surah: 7,
  ayah: 128,
  arabic: "قَالَ مُوسَىٰ لِقَوْمِهِ اسْتَعِينُوا بِاللَّهِ وَاصْبِرُوا ۖ إِنَّ الْأَرْضَ لِلَّهِ يُورِثُهَا مَن يَشَاءُ مِنْ عِبَادِهِ ۖ وَالْعاقِبَةُ لِلْمُتَّقِينَ",
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

// Expanded sample verses for search functionality testing
export const extendedSampleVerses: Verse[] = [
  {
    id: 1,
    surah: 2,
    ayah: 155,
    arabic: "وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ",
    translation: "And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient",
    surahName: "Al-Baqarah",
    totalVerses: 286
  },
  {
    id: 2,
    surah: 3,
    ayah: 159,
    arabic: "فَبِمَا رَحْمَةٍ مِّنَ اللَّهِ لِنتَ لَهُمْ ۖ وَلَوْ كُنتَ فَظًّا غَلِيظَ الْقَلْبِ لَانفَضُّوا مِنْ حَوْلِكَ ۖ فَاعْفُ عَنْهُمْ وَاسْتَغْفِرْ لَهُمْ وَشَاوِرْهُمْ فِي الْأَمْرِ ۖ فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ ۚ إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ",
    translation: "So by mercy from Allah, [O Muhammad], you were lenient with them. And if you had been rude [in speech] and harsh in heart, they would have disbanded from about you. So pardon them and ask forgiveness for them and consult them in the matter. And when you have decided, then rely upon Allah. Indeed, Allah loves those who rely [upon Him].",
    surahName: "Ali 'Imran",
    totalVerses: 200
  },
  {
    id: 3,
    surah: 7,
    ayah: 128,
    arabic: "قَالَ مُوسَىٰ لِقَوْمِهِ اسْتَعِينُوا بِاللَّهِ وَاصْبِرُوا ۖ إِنَّ الْأَرْضَ لِلَّهِ يُورِثُهَا مَن يَشَاءُ مِنْ عِبَادِهِ ۖ وَالْعاقِبَةُ لِلْمُتَّقِينَ",
    translation: "Moses reassured his people, \"Seek Allah's help and be patient. Indeed, the earth belongs to Allah (alone). He grants it to whoever He chooses of His servants. The ultimate outcome belongs (only) to the righteous.\"",
    surahName: "Al-Araf",
    totalVerses: 206
  },
  {
    id: 4,
    surah: 94,
    ayah: 5,
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship [will be] ease.",
    surahName: "Ash-Sharh",
    totalVerses: 8
  },
  {
    id: 5,
    surah: 94,
    ayah: 6,
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Indeed, with hardship [will be] ease.",
    surahName: "Ash-Sharh",
    totalVerses: 8
  },
  {
    id: 6,
    surah: 21,
    ayah: 87,
    arabic: "وَذَا النُّونِ إِذ ذَّهَبَ مُغَاضِبًا فَظَنَّ أَن لَّن نَّقْدِرَ عَلَيْهِ فَنَادَىٰ فِي الظُّلُمَاتِ أَن لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    translation: "And [mention] the man of the fish, when he went off in anger and thought that We would not decree [anything] upon him. And he called out within the darknesses, 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.'",
    surahName: "Al-Anbya",
    totalVerses: 112
  },
  {
    id: 7,
    surah: 2,
    ayah: 286,
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: "Allah does not burden a soul beyond that it can bear",
    surahName: "Al-Baqarah",
    totalVerses: 286
  },
  {
    id: 8,
    surah: 4,
    ayah: 36,
    arabic: "۞ وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا ۖ وَبِالْوَالِدَيْنِ إِحْسَانًا وَبِذِي الْقُرْبَىٰ وَالْيَتَامَىٰ وَالْمَسَاكِينِ وَالْجَارِ ذِي الْقُرْبَىٰ وَالْجَارِ الْجُنُبِ وَالصَّاحِبِ بِالْجَنبِ وَابْنِ السَّبِيلِ وَمَا مَلَكَتْ أَيْمَانُكُمْ ۗ إِنَّ اللَّهَ لَا يُحِبُّ مَن كَانَ مُخْتَالًا فَخُورًا",
    translation: "Worship Allah and associate nothing with Him, and to parents do good, and to relatives, orphans, the needy, the near neighbor, the neighbor farther away, the companion at your side, the traveler, and those whom your right hands possess. Indeed, Allah does not like those who are self-deluding and boastful.",
    surahName: "An-Nisa",
    totalVerses: 176
  },
  {
    id: 9,
    surah: 49,
    ayah: 13,
    arabic: "يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا ۚ إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ ۚ إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ",
    translation: "O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another. Indeed, the most noble of you in the sight of Allah is the most righteous of you. Indeed, Allah is Knowing and Acquainted.",
    surahName: "Al-Hujurat",
    totalVerses: 18
  },
  {
    id: 10,
    surah: 55,
    ayah: 1,
    arabic: "الرَّحْمَٰنُ",
    translation: "The Most Merciful",
    surahName: "Ar-Rahman",
    totalVerses: 78
  },
  {
    id: 11,
    surah: 55,
    ayah: 2,
    arabic: "عَلَّمَ الْقُرْآنَ",
    translation: "Taught the Qur'an",
    surahName: "Ar-Rahman",
    totalVerses: 78
  },
  {
    id: 12,
    surah: 55,
    ayah: 3,
    arabic: "خَلَقَ الْإِنسَانَ",
    translation: "Created man",
    surahName: "Ar-Rahman",
    totalVerses: 78
  },
  {
    id: 13,
    surah: 55,
    ayah: 4,
    arabic: "عَلَّمَهُ الْبَيَانَ",
    translation: "And taught him eloquence",
    surahName: "Ar-Rahman",
    totalVerses: 78
  },
  {
    id: 14,
    surah: 103,
    ayah: 1,
    arabic: "وَالْعَصْرِ",
    translation: "By time",
    surahName: "Al-Asr",
    totalVerses: 3
  },
  {
    id: 15,
    surah: 103,
    ayah: 2,
    arabic: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
    translation: "Indeed, mankind is in loss",
    surahName: "Al-Asr",
    totalVerses: 3
  },
  {
    id: 16,
    surah: 103,
    ayah: 3,
    arabic: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
    translation: "Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience",
    surahName: "Al-Asr",
    totalVerses: 3
  }
];
