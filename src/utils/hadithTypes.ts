
export interface Hadith {
  id: number;
  collection: string;  // e.g., "Sahih Bukhari" or "Sahih Muslim"
  bookNumber: number;
  chapterNumber: number;
  hadithNumber: number;
  arabic: string;
  english: string;
  reference: string;
  grade?: string;  // authenticity grade if available
}

// Sample data for testing and fallback
export const sampleHadith: Hadith = {
  id: 1,
  collection: "Sahih Bukhari",
  bookNumber: 1,
  chapterNumber: 1,
  hadithNumber: 1,
  arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ",
  english: "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for.",
  reference: "Sahih Bukhari 1:1"
};

// Extended sample hadiths for search functionality
export const sampleHadiths: Hadith[] = [
  sampleHadith,
  {
    id: 2,
    collection: "Sahih Muslim",
    bookNumber: 1,
    chapterNumber: 1,
    hadithNumber: 1,
    arabic: "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ، قَالَ: سَمِعْت رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: إنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    english: "Actions are according to intentions, and everyone will get what was intended.",
    reference: "Sahih Muslim 1:1"
  },
  {
    id: 3,
    collection: "Sahih Bukhari",
    bookNumber: 2,
    chapterNumber: 3,
    hadithNumber: 8,
    arabic: "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ",
    english: "Islam is built upon five pillars: testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, performing the prayers, paying the zakat, making the pilgrimage to the House, and fasting in Ramadan.",
    reference: "Sahih Bukhari 2:3:8"
  }
];
