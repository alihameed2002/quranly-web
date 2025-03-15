
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
  // Normalize query and split into individual terms
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

// Simple string matching that looks for partial matches
const textContainsTerm = (text: string, term: string): boolean => {
  return text.toLowerCase().includes(term.toLowerCase());
};

// Score a verse based on matching terms and synonym proximity
export const scoreVerse = (verse: Verse, searchTerms: string[]): number => {
  // Ensure we have a translation to search in
  const text = verse.translation?.toLowerCase() || "";
  
  if (!text) return 0;
  
  let score = 0;
  
  // Check each search term
  searchTerms.forEach(term => {
    // Look for partial matches to be more lenient
    if (textContainsTerm(text, term)) {
      // Direct match gets higher score
      score += 10;
      
      // Bonus points for exact matches (surrounded by word boundaries)
      const exactMatchRegex = new RegExp(`\\b${term}\\b`, 'i');
      if (exactMatchRegex.test(text)) {
        score += 5;
      }
    }
  });
  
  // Add a small bonus for shorter verses (more relevant matches)
  if (score > 0 && text.length < 100) {
    score += 2;
  }
  
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
  // Return empty array for empty queries
  if (!query.trim()) return [];
  
  const searchTerms = expandSearchTerms(query);
  const scoredResults: ScoredSearchResult[] = [];
  
  // Check if we have verses to search
  if (!verses || verses.length === 0) {
    console.warn("No verses provided for search");
    return [];
  }
  
  // Score each verse
  verses.forEach(verse => {
    const score = scoreVerse(verse, searchTerms);
    if (score > 0) {
      scoredResults.push({...verse, score});
    }
  });
  
  // Debugging
  console.log(`Search for "${query}" found ${scoredResults.length} results`);
  console.log("Search terms:", searchTerms);
  
  // Sort by score (highest first)
  scoredResults.sort((a, b) => b.score - a.score);
  
  // Return the sorted results without the score property
  return scoredResults.map(({score, ...verse}) => verse);
};
