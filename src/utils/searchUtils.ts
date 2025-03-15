
import { Verse } from './quranData';

// Map of common Islamic/Quranic terms and their synonyms 
// This helps with finding related terms
const synonymMap: Record<string, string[]> = {
  // Divine attributes and names
  "god": ["allah", "lord", "creator", "divine"],
  "allah": ["god", "lord", "creator", "divine"],
  "mercy": ["compassion", "forgiveness", "kindness", "grace", "clemency"],
  "forgiveness": ["mercy", "pardon", "clemency", "absolution"],
  
  // Spiritual concepts
  "prayer": ["salah", "worship", "supplication", "dua"],
  "faith": ["belief", "iman", "conviction", "trust", "devotion"],
  "patience": ["perseverance", "endurance", "steadfastness", "fortitude", "sabr"],
  "guidance": ["direction", "hidayah", "leadership", "instruction"],
  "charity": ["giving", "sadaqah", "zakat", "alms", "donation"],
  
  // Ethical concepts
  "justice": ["fairness", "equity", "righteousness", "balance", "impartiality"],
  "truth": ["reality", "verity", "honesty", "fact", "genuineness"],
  "kindness": ["compassion", "benevolence", "gentleness", "goodwill"],
  
  // Challenges and spiritual states
  "hardship": ["difficulty", "adversity", "trial", "suffering", "tribulation"],
  "ease": ["relief", "comfort", "facility", "convenience"],
  "gratitude": ["thankfulness", "appreciation", "gratefulness", "shukr"],
  
  // Afterlife concepts
  "paradise": ["heaven", "jannah", "garden", "bliss"],
  "hell": ["fire", "jahannam", "punishment", "torment"],
  
  // Prophets and figures
  "muhammad": ["prophet", "messenger", "ahmad"],
  "jesus": ["isa", "messiah", "christ"],
  "moses": ["musa"],
  "abraham": ["ibrahim"],
  "noah": ["nuh"],
  
  // Behavioral concepts
  "modesty": ["humility", "shyness", "decency", "hayaa"],
  "repentance": ["regret", "remorse", "contrition", "tawbah"],
  "hope": ["expectation", "aspiration", "optimism", "anticipation"]
};

// Function to get all possible search terms including synonyms
export const expandSearchTerms = (query: string): string[] => {
  const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
  const expandedTerms = new Set<string>();
  
  // Add original terms
  terms.forEach(term => expandedTerms.add(term));
  
  // Add synonyms for each term
  terms.forEach(term => {
    if (synonymMap[term]) {
      synonymMap[term].forEach(synonym => expandedTerms.add(synonym));
    }
  });
  
  return Array.from(expandedTerms);
};

// Score a verse based on matching terms and synonym proximity
export const scoreVerse = (verse: Verse, searchTerms: string[]): number => {
  const text = verse.translation.toLowerCase();
  let score = 0;
  
  searchTerms.forEach(term => {
    if (text.includes(term)) {
      // Direct match gets higher score
      score += 10;
      
      // Check if this is a synonym of the original query (gets lower score)
      if (term !== searchTerms[0]) {
        score += 5;
      }
    }
  });
  
  return score;
};

// Interface for a simple search result with score for ranking
export interface ScoredSearchResult extends Verse {
  score: number;
}

// Helper function to extract data from collection of verses for search
export const prepareVersesForSearch = (verses: Verse[]): Verse[] => {
  return verses.map(verse => ({
    ...verse,
    // Ensure the translation is usable for search
    translation: verse.translation || ""
  }));
};

export const searchVerses = (verses: Verse[], query: string): Verse[] => {
  if (!query.trim()) return [];
  
  const searchTerms = expandSearchTerms(query);
  const scoredResults: ScoredSearchResult[] = [];
  
  verses.forEach(verse => {
    const score = scoreVerse(verse, searchTerms);
    if (score > 0) {
      scoredResults.push({...verse, score});
    }
  });
  
  // Sort by score (highest first)
  scoredResults.sort((a, b) => b.score - a.score);
  
  // Return the sorted results without the score property
  return scoredResults.map(({score, ...verse}) => verse);
};
