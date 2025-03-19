export interface Hadith {
  id: string;
  collection: string;  // e.g., "bukhari", "muslim", etc.
  bookNumber: string;
  chapterNumber: string;
  hadithNumber: string;
  arabic: string;
  english: string;
  reference: string;
  grade?: string;  // authenticity grade if available
  narrator?: string; // narrator of the hadith
}

// Sample data for testing and fallback
export const sampleHadith: Hadith = {
  id: "bukhari:1:1",
  collection: "bukhari",
  bookNumber: "1",
  chapterNumber: "1",
  hadithNumber: "1",
  arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ",
  english: "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for.",
  reference: "Sahih al-Bukhari, Book 1, Hadith 1",
  narrator: "Umar ibn Al-Khattab"
};

// Extended sample hadiths for search functionality
export const sampleHadiths: Hadith[] = [
  sampleHadith,
  {
    id: "muslim:1:1",
    collection: "muslim",
    bookNumber: "1",
    chapterNumber: "1",
    hadithNumber: "1",
    arabic: "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ، قَالَ: سَمِعْت رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: إنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    english: "Actions are according to intentions, and everyone will get what was intended.",
    reference: "Sahih Muslim, Book 1, Hadith 1",
    narrator: "Umar ibn Al-Khattab"
  },
  {
    id: "bukhari:2:8",
    collection: "bukhari",
    bookNumber: "2",
    chapterNumber: "3",
    hadithNumber: "8",
    arabic: "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ",
    english: "Islam is built upon five pillars: testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, performing the prayers, paying the zakat, making the pilgrimage to the House, and fasting in Ramadan.",
    reference: "Sahih al-Bukhari, Book 2, Hadith 8",
    narrator: "Ibn Umar"
  },
  {
    id: "nawawi40:1",
    collection: "nawawi40",
    bookNumber: "1",
    chapterNumber: "",
    hadithNumber: "1",
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    english: "Actions are judged by intentions, so each man will have what he intended.",
    reference: "40 Hadith of Imam Nawawi, Hadith 1",
    narrator: "Umar ibn Al-Khattab"
  },
  {
    id: "riyadussalihin:1:1",
    collection: "riyadussalihin",
    bookNumber: "1",
    chapterNumber: "1",
    hadithNumber: "1",
    arabic: "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ، قَالَ: سَمِعْت رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: إنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    english: "The reward of deeds depends upon the intentions.",
    reference: "Riyad as-Salihin, Book 1, Hadith 1",
    narrator: "Umar ibn Al-Khattab"
  }
];
