
import { Verse } from './quranData';

// A smaller core synonym map for essential Islamic/Quranic concepts 
// This will supplement our more advanced matching techniques
const coreSynonyms: Record<string, string[]> = {
  "god": ["allah", "lord", "creator"],
  "allah": ["god", "lord"],
  "mercy": ["compassion", "forgiveness", "rahma", "rahman", "rahim"],
  "prayer": ["salah", "worship", "salat"],
  "quran": ["book", "scripture", "recitation"],
  "prophet": ["messenger", "rasul", "nabi"]
};

// More advanced text normalization 
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    // Remove common punctuation and diacritics
    .replace(/[.,;:'"!?()-]/g, ' ')
    // Convert multiple spaces to single
    .replace(/\s+/g, ' ')
    .trim();
};

// Function to get word roots (simple implementation)
const getWordRoot = (word: string): string => {
  const simpleSuffixes = ['ing', 'ed', 'es', 's', 'ers', 'er'];
  let root = word.toLowerCase();
  
  // Only apply stemming to longer words (4+ characters)
  if (root.length <= 3) return root;
  
  // Simple stemming
  for (const suffix of simpleSuffixes) {
    if (root.endsWith(suffix) && root.length - suffix.length >= 3) {
      return root.slice(0, root.length - suffix.length);
    }
  }
  
  return root;
};

// Function to break text into tokens with roots
const tokenizeText = (text: string): string[] => {
  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/);
  
  // Get unique tokens including word roots
  const tokens = new Set<string>();
  
  words.forEach(word => {
    if (word.length > 1) {
      tokens.add(word);
      const root = getWordRoot(word);
      if (root !== word) {
        tokens.add(root);
      }
    }
  });
  
  return Array.from(tokens);
};

// Get expanded search terms based on tokens and core synonyms
export const expandSearchTerms = (query: string): string[] => {
  if (!query.trim()) return [];
  
  const tokens = tokenizeText(query);
  const expandedTerms = new Set<string>(tokens);
  
  // Add core synonyms
  tokens.forEach(token => {
    // Check direct matches in core synonyms
    if (coreSynonyms[token]) {
      coreSynonyms[token].forEach(synonym => expandedTerms.add(synonym));
    }
    
    // Check if token is in any synonym list
    Object.entries(coreSynonyms).forEach(([key, synonyms]) => {
      if (synonyms.includes(token)) {
        expandedTerms.add(key);
        synonyms.forEach(s => expandedTerms.add(s));
      }
    });
  });
  
  return Array.from(expandedTerms);
};

// Calculate token frequency in a text
const getTokenFrequency = (tokens: string[], text: string): Map<string, number> => {
  const frequencies = new Map<string, number>();
  const normalizedText = normalizeText(text);
  
  tokens.forEach(token => {
    // Don't count very short tokens
    if (token.length <= 2) return;
    
    // Basic token occurrence count
    const regex = new RegExp(`\\b${token}\\b|${token}`, 'gi');
    const matches = normalizedText.match(regex) || [];
    frequencies.set(token, matches.length);
  });
  
  return frequencies;
};

// Function to match a text against a search query with comprehensive analysis
const matchTextToQuery = (text: string, searchTokens: string[]): number => {
  if (!text || searchTokens.length === 0) return 0;
  
  // Normalize and tokenize the text
  const normalizedText = normalizeText(text);
  const textTokens = tokenizeText(text);
  
  // Prepare for TF-IDF style scoring (simplified)
  const tokenFrequencies = getTokenFrequency(searchTokens, normalizedText);
  let score = 0;
  
  // Score based on token presence and frequency
  searchTokens.forEach(token => {
    const frequency = tokenFrequencies.get(token) || 0;
    
    // Skip tokens that don't appear
    if (frequency === 0) return;
    
    // Base score for token presence
    score += 5;
    
    // Additional points for higher frequency
    score += Math.min(frequency * 2, 10);
    
    // Bonus for exact phrase matches
    const phraseRegex = new RegExp(`\\b${token}\\b`, 'i');
    if (phraseRegex.test(normalizedText)) {
      score += 5;
    }
    
    // Bonus for matches at the beginning of the text
    if (normalizedText.substring(0, 50).includes(token)) {
      score += 3;
    }
    
    // Bonus for longer token matches (more specific)
    if (token.length > 4) {
      score += 2;
    }
  });
  
  // Check for multiple token matches (phrase relevance)
  if (score > 0) {
    const uniqueMatchedTokens = searchTokens.filter(token => tokenFrequencies.get(token) || 0 > 0);
    // Boost score significantly when multiple tokens match
    if (uniqueMatchedTokens.length > 1) {
      score += uniqueMatchedTokens.length * 5;
      
      // Check for tokens appearing close together
      let tokenProximityBonus = 0;
      for (let i = 0; i < uniqueMatchedTokens.length; i++) {
        for (let j = i + 1; j < uniqueMatchedTokens.length; j++) {
          const indexA = normalizedText.indexOf(uniqueMatchedTokens[i]);
          const indexB = normalizedText.indexOf(uniqueMatchedTokens[j]);
          
          if (indexA >= 0 && indexB >= 0) {
            const distance = Math.abs(indexA - indexB);
            // Tokens appearing within 20 characters of each other get a proximity bonus
            if (distance < 20) {
              tokenProximityBonus += 5;
            }
          }
        }
      }
      score += tokenProximityBonus;
    }
  }
  
  return Math.min(score, 100); // Cap score at 100
};

// Score a verse based on text matching with the query
export const scoreVerse = (verse: Verse, searchTokens: string[]): number => {
  if (!verse.translation) return 0;
  
  // Get match score for the translation
  const score = matchTextToQuery(verse.translation, searchTokens);
  
  // Return 0 if below threshold to eliminate poor matches
  return score < 10 ? 0 : score;
};

// Interface for search result with score
export interface ScoredSearchResult extends Verse {
  score: number;
}

// Main search function
export const searchVerses = (verses: Verse[], query: string): Verse[] => {
  if (!query.trim() || !verses || verses.length === 0) return [];
  
  // Prepare search tokens from the query
  const searchTokens = tokenizeText(query);
  const expandedTokens = expandSearchTerms(query);
  const allSearchTokens = Array.from(new Set([...searchTokens, ...expandedTokens]));
  
  // Skip very common or short search terms
  const filteredTokens = allSearchTokens.filter(token => token.length > 2);
  
  // Log search information for debugging
  console.log(`Searching for: "${query}"`);
  console.log("Search tokens:", filteredTokens);
  
  // Score and filter verses
  const scoredResults: ScoredSearchResult[] = [];
  
  verses.forEach(verse => {
    if (!verse.translation) return;
    
    const score = scoreVerse(verse, filteredTokens);
    if (score > 0) {
      scoredResults.push({...verse, score});
    }
  });
  
  // Sort results by score (highest first)
  scoredResults.sort((a, b) => b.score - a.score);
  
  // Log results for debugging
  console.log(`Found ${scoredResults.length} results`);
  if (scoredResults.length > 0) {
    console.log("Top 3 results:");
    scoredResults.slice(0, 3).forEach((result, i) => {
      console.log(`${i+1}. Score ${result.score}: "${result.translation.substring(0, 100)}..."`);
    });
  }
  
  // Return verses without score property
  return scoredResults.map(({score, ...verse}) => verse);
};

// Prepare verses for search by ensuring they have proper text fields
export const prepareVersesForSearch = (verses: Verse[]): Verse[] => {
  return verses.map(verse => ({
    ...verse,
    translation: verse.translation || ""
  }));
};
