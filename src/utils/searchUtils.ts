
import { Verse } from './quranData';

// Expanded map of common Islamic/Quranic terms and their synonyms 
// This helps with finding related terms
const synonymMap: Record<string, string[]> = {
  // Divine attributes and names
  "god": ["allah", "lord", "creator", "divine", "deity", "almighty"],
  "allah": ["god", "lord", "creator", "divine", "deity", "almighty"],
  "mercy": ["compassion", "forgiveness", "kindness", "grace", "clemency", "benevolence", "rahma", "rahman", "rahim"],
  "forgiveness": ["mercy", "pardon", "clemency", "absolution", "forgive", "forgiving", "ghafoor", "ghaffar"],
  
  // Spiritual concepts
  "prayer": ["salah", "worship", "supplication", "dua", "pray", "praying", "salat"],
  "faith": ["belief", "iman", "conviction", "trust", "devotion", "faithful", "believe", "believing"],
  "patience": ["perseverance", "endurance", "steadfastness", "fortitude", "sabr", "patient", "endure"],
  "guidance": ["direction", "hidayah", "leadership", "instruction", "guide", "guiding", "guided", "path"],
  "charity": ["giving", "sadaqah", "zakat", "alms", "donation", "donate", "charitable", "generosity"],
  
  // Ethical concepts
  "justice": ["fairness", "equity", "righteousness", "balance", "impartiality", "just", "fair", "adl"],
  "truth": ["reality", "verity", "honesty", "fact", "genuineness", "true", "haqq"],
  "kindness": ["compassion", "benevolence", "gentleness", "goodwill", "kind", "gentle", "ihsan"],
  
  // Challenges and spiritual states
  "hardship": ["difficulty", "adversity", "trial", "suffering", "tribulation", "test", "challenge", "struggle"],
  "ease": ["relief", "comfort", "facility", "convenience", "yusr", "relieved", "comfortable"],
  "gratitude": ["thankfulness", "appreciation", "gratefulness", "shukr", "grateful", "thankful", "thank"],
  
  // Afterlife concepts
  "paradise": ["heaven", "jannah", "garden", "bliss", "gardens", "eden"],
  "hell": ["fire", "jahannam", "punishment", "torment", "hellfire", "naar"],
  
  // Prophets and figures
  "muhammad": ["prophet", "messenger", "ahmad", "mohammed", "mohammed", "rasul", "nabi"],
  "jesus": ["isa", "messiah", "christ"],
  "moses": ["musa"],
  "abraham": ["ibrahim", "ibrahim", "friend of allah"],
  "noah": ["nuh"],
  "mary": ["maryam", "mother of jesus"],
  "joseph": ["yusuf"],
  "jacob": ["yaqub"],
  "adam": ["first man"],
  "solomon": ["sulaiman"],
  "david": ["dawud"],
  
  // Behavioral concepts
  "modesty": ["humility", "shyness", "decency", "hayaa", "modest", "humble"],
  "repentance": ["regret", "remorse", "contrition", "tawbah", "repent", "turning back"],
  "hope": ["expectation", "aspiration", "optimism", "anticipation", "hopeful"],
  
  // Religious obligations
  "fast": ["fasting", "sawm", "ramadan", "abstain"],
  "pilgrimage": ["hajj", "umrah", "pilgrim", "mecca", "kaaba"],
  
  // Important Islamic concepts
  "quran": ["book", "scripture", "revelation", "recitation", "verses", "ayat", "surahs"],
  "islam": ["submission", "muslim", "muslims", "surrender", "peace"],
  "sin": ["transgression", "disobedience", "error", "wrongdoing", "wrong"],
  "angels": ["angel", "malak", "malaika", "gabriel", "jibreel", "mikail"],
  "resurrection": ["afterlife", "hereafter", "akhirah", "last day", "judgment", "qiyamah"],
  "worship": ["ibadah", "devotion", "adoration", "reverence", "serve", "serving"],
  "trust": ["reliance", "tawakkul", "dependence", "rely", "tawakkul"],
  "christian": ["christianity", "christians", "church", "jesus followers"],
  "jew": ["judaism", "jewish", "jews", "children of israel", "israelites"]
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
    // Check for exact matches in the synonym map
    if (synonymMap[term]) {
      synonymMap[term].forEach(synonym => expandedTerms.add(synonym));
    }
    
    // Check for partial matches in the synonym map keys
    Object.keys(synonymMap).forEach(key => {
      if (key.includes(term) || term.includes(key)) {
        // Add this key and all its synonyms
        expandedTerms.add(key);
        synonymMap[key].forEach(synonym => expandedTerms.add(synonym));
      }
    });
    
    // Check within synonym values for partial matches
    Object.entries(synonymMap).forEach(([key, synonyms]) => {
      synonyms.forEach(synonym => {
        if (synonym.includes(term) || term.includes(synonym)) {
          // Add this synonym, its key, and all related synonyms
          expandedTerms.add(key);
          expandedTerms.add(synonym);
          synonymMap[key].forEach(s => expandedTerms.add(s));
        }
      });
    });
  });
  
  return Array.from(expandedTerms);
};

// Improved string matching that looks for partial and fuzzy matches
const textContainsTerm = (text: string, term: string): boolean => {
  const normalizedText = text.toLowerCase();
  const normalizedTerm = term.toLowerCase();
  
  // Exact match
  if (normalizedText.includes(normalizedTerm)) {
    return true;
  }
  
  // Check for word boundaries
  const wordBoundaryRegex = new RegExp(`\\b${normalizedTerm}\\b`, 'i');
  if (wordBoundaryRegex.test(normalizedText)) {
    return true;
  }
  
  // For short terms (3 chars or less), require exact matches
  if (normalizedTerm.length <= 3) {
    return normalizedText.includes(normalizedTerm);
  }
  
  // For longer terms, try stemming (simplified version - remove common endings)
  const stemmed = normalizedTerm
    .replace(/ing$|ed$|es$|s$/, '')
    .replace(/ers$|er$/, '');
  
  if (stemmed !== normalizedTerm && normalizedText.includes(stemmed)) {
    return true;
  }
  
  // For terms longer than 5 chars, allow partial matching (beginning of words)
  if (normalizedTerm.length > 5) {
    const words = normalizedText.split(/\s+/);
    return words.some(word => word.startsWith(normalizedTerm) || normalizedTerm.startsWith(word));
  }
  
  return false;
};

// Score a verse based on matching terms and synonym proximity
export const scoreVerse = (verse: Verse, searchTerms: string[]): number => {
  // Ensure we have a translation to search in
  const text = verse.translation?.toLowerCase() || "";
  
  if (!text) return 0;
  
  let score = 0;
  const matchedTerms = new Set<string>();
  
  // Check each search term
  searchTerms.forEach(term => {
    // Skip very short terms unless they're exact matches
    if (term.length < 3 && !text.includes(` ${term} `)) {
      return;
    }
    
    // Look for matches
    if (textContainsTerm(text, term)) {
      // Direct match gets higher score
      score += 10;
      matchedTerms.add(term);
      
      // Bonus points for exact matches (surrounded by word boundaries)
      const exactMatchRegex = new RegExp(`\\b${term}\\b`, 'i');
      if (exactMatchRegex.test(text)) {
        score += 5;
      }
      
      // Bonus for matches at the beginning of the verse
      if (text.substring(0, 50).includes(term)) {
        score += 3;
      }
      
      // Count occurrences for multiple matches
      const occurrences = (text.match(new RegExp(term, 'gi')) || []).length;
      if (occurrences > 1) {
        score += occurrences * 2;
      }
    }
  });
  
  // Boost score based on number of unique matched terms
  if (matchedTerms.size > 1) {
    score += matchedTerms.size * 5; // Bonus for matching multiple terms
  }
  
  // Adjust score based on verse length
  // Shorter verses with matches are often more relevant
  if (score > 0) {
    if (text.length < 100) {
      score += 5;
    } else if (text.length > 400) {
      score -= 3; // Slightly penalize very long verses
    }
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
  
  // Log sample results for debugging
  if (scoredResults.length > 0) {
    console.log("Top 3 results with scores:");
    scoredResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .forEach((result, idx) => {
        console.log(`${idx+1}. Score ${result.score}: "${result.translation.substring(0, 100)}..."`);
      });
  }
  
  // Sort by score (highest first)
  scoredResults.sort((a, b) => b.score - a.score);
  
  // Return the sorted results without the score property
  return scoredResults.map(({score, ...verse}) => verse);
};
