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

const sampleVerses: Verse[] = [
  {
    id: 1,
    surah: 1,
    ayah: 1,
    arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful."
  },
  {
    id: 2,
    surah: 2,
    ayah: 255,
    arabic: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ",
    translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great."
  },
  {
    id: 3,
    surah: 7,
    ayah: 128,
    arabic: "قَالَ مُوسَىٰ لِقَوْمِهِ اسْتَعِينُوا بِاللَّهِ وَاصْبِرُوا ۖ إِنَّ الْأَرْضَ لِلَّهِ يُورِثُهَا مَنْ يَشَاءُ مِنْ عِبَادِهِ ۖ وَالْعَاقِبَةُ لِلْمُتَّقِينَ",
    translation: "Moses said to his people, “Seek help through Allah and be patient. Indeed, the earth belongs to Allah. He causes to inherit it whom He wills of His servants. And the [best] outcome is for the righteous.”"
  },
  {
    id: 9001,
    surah: 2,
    ayah: 201,
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    translation: "Our Lord, give us in this world good and in the Hereafter good and protect us from the punishment of the Fire."
  },
  {
    id: 9002,
    surah: 3,
    ayah: 103,
    arabic: "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا",
    translation: "And hold firmly to the rope of Allah all together and do not become divided."
  },
  {
    id: 9003,
    surah: 94,
    ayah: 5,
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship will be ease."
  },
  {
    id: 9004,
    surah: 94,
    ayah: 6,
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Indeed, with hardship will be ease."
  },
  {
    id: 9005,
    surah: 2,
    ayah: 286,
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: "Allah does not charge a soul except with that within its capacity."
  },
  {
    id: 9006,
    surah: 49,
    ayah: 13,
    arabic: "إِنَّ أَكْرَمَكُمْ عِنْدَ اللَّهِ أَتْقَاكُمْ",
    translation: "Indeed, the most noble of you in the sight of Allah is the most righteous of you."
  },
  {
    id: 9007,
    surah: 17,
    ayah: 70,
    arabic: "وَلَقَدْ كَرَّمْنَا بَنِي آدَمَ وَحَمَلْنَاهُمْ فِي الْبَرِّ وَالْبَحْرِ",
    translation: "And We have certainly honored the children of Adam and carried them on the land and sea."
  },
  {
    id: 9008,
    surah: 55,
    ayah: 7,
    arabic: "وَالسَّمَاءَ رَفَعَهَا وَوَضَعَ الْمِيزَانَ",
    translation: "And the heaven He raised and imposed the balance."
  },
  {
    id: 9009,
    surah: 21,
    ayah: 107,
    arabic: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِلْعَالَمِينَ",
    translation: "And We have not sent you, [O Muhammad], except as a mercy to the worlds."
  },
  {
    id: 9010,
    surah: 33,
    ayah: 70,
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا",
    translation: "O you who have believed, fear Allah and speak words of appropriate justice."
  }
];

export const fetchSurah = async (surahId: number): Promise<Surah> => {
  try {
    const response = await fetch(`http://api.alquran.cloud/v1/surah/${surahId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Could not fetch surah');
    }
    
    return {
      id: data.data.number,
      name: data.data.name,
      englishName: data.data.englishName,
      englishNameTranslation: data.data.englishNameTranslation,
      numberOfAyahs: data.data.numberOfAyahs,
      revelationType: data.data.revelationType,
    };
  } catch (error: any) {
    console.error("Error fetching surah:", error);
    throw error;
  }
};

export const fetchVerse = async (surahId: number, verseId: number): Promise<Verse> => {
  try {
    const response = await fetch(`http://api.alquran.cloud/v1/ayah/${surahId}:${verseId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Could not fetch verse');
    }
    
    return {
      id: data.data.number,
      surah: data.data.surah.number,
      ayah: data.data.numberInSurah,
      arabic: data.data.text,
      translation: data.data.translation,
    };
  } catch (error: any) {
    console.error("Error fetching verse:", error);
    throw error;
  }
};

export const fetchSearchResults = async (keyword: string): Promise<Verse[]> => {
  console.info(`Executing search for: ${keyword}`);
  if (!keyword.trim()) {
    return [];
  }
  
  const safeKeyword = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  console.info(`Searching for: ${safeKeyword}`);
  
  try {
    const regex = new RegExp(safeKeyword, 'i');
    const localResults = sampleVerses.filter(verse => 
      regex.test(verse.translation) || regex.test(verse.arabic)
    );
    
    const enhancedResults = await Promise.all(localResults.map(async (verse) => {
      try {
        const surah = await fetchSurah(verse.surah);
        return {
          ...verse,
          surahName: surah.englishName,
          totalVerses: surah.numberOfAyahs
        };
      } catch (error) {
        console.error("Error enhancing search result:", error);
        return verse;
      }
    }));
    
    console.info(`Found ${enhancedResults.length} verses matching "${keyword}"`);
    return enhancedResults;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};

export const fetchSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch('http://api.alquran.cloud/v1/surah');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Could not fetch surahs');
    }
    
    return data.data.map((surah: any) => ({
      id: surah.number,
      name: surah.name,
      englishName: surah.englishName,
      englishNameTranslation: surah.englishNameTranslation,
      numberOfAyahs: surah.numberOfAyahs,
      revelationType: surah.revelationType,
    }));
  } catch (error) {
    console.error("Error fetching surahs:", error);
    return [
      {
        id: 1,
        name: "الفاتحة",
        englishName: "Al-Fatiha",
        englishNameTranslation: "The Opening",
        numberOfAyahs: 7,
        revelationType: "Meccan"
      },
      {
        id: 2,
        name: "البقرة",
        englishName: "Al-Baqarah",
        englishNameTranslation: "The Cow",
        numberOfAyahs: 286,
        revelationType: "Medinan"
      },
      {
        id: 7,
        name: "الأعراف",
        englishName: "Al-A'raf",
        englishNameTranslation: "The Heights",
        numberOfAyahs: 206,
        revelationType: "Meccan"
      }
    ];
  }
};

export const fetchQuranData = async (surahId: number, verseId: number): Promise<{ surah: Surah; verse: Verse }> => {
  try {
    const [surah, verse] = await Promise.all([
      fetchSurah(surahId),
      fetchVerse(surahId, verseId)
    ]);
    
    return { surah, verse };
  } catch (error) {
    console.error("Error fetching Quran data:", error);
    throw error;
  }
};
