
import { Verse } from './quranData';

// Comprehensive text normalization for better matching
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    // Remove common punctuation, diacritics and special characters
    .replace(/[.,;:'"!?()[\]{}*&^%$#@~`|\\/<>+=_-]/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
};

// Advanced word stemming algorithm (Porter-like simplified stemming)
const stemWord = (word: string): string => {
  if (word.length < 4) return word;
  
  let stem = word.toLowerCase();
  
  // Handle common plurals and verb forms
  if (stem.endsWith('ies') && stem.length > 4) {
    return stem.slice(0, -3) + 'y';
  } else if (stem.endsWith('es') && stem.length > 3) {
    return stem.slice(0, -2);
  } else if (stem.endsWith('s') && !stem.endsWith('ss') && stem.length > 3) {
    return stem.slice(0, -1);
  }
  
  // Handle common suffixes
  const suffixes = ['ing', 'ed', 'ly', 'ment', 'ness', 'ity', 'tion', 'ation', 'ible', 'able'];
  for (const suffix of suffixes) {
    if (stem.endsWith(suffix) && stem.length - suffix.length >= 3) {
      return stem.slice(0, stem.length - suffix.length);
    }
  }
  
  return stem;
};

// Tokenize text into words and their stems
const tokenizeText = (text: string): string[] => {
  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/);
  
  // Get unique tokens including word stems
  const tokens = new Set<string>();
  
  words.forEach(word => {
    if (word.length > 1) {
      tokens.add(word);
      const stem = stemWord(word);
      if (stem !== word) {
        tokens.add(stem);
      }
    }
  });
  
  return Array.from(tokens);
};

// Calculate fuzzy match score between a token and text
const calculateFuzzyMatchScore = (token: string, text: string): number => {
  if (!token || !text || token.length < 2) return 0;
  
  const normalizedText = normalizeText(text);
  const normalizedToken = normalizeText(token);
  
  // Exact word match gets highest score
  const wordPattern = new RegExp(`\\b${normalizedToken}\\b`, 'i');
  if (wordPattern.test(normalizedText)) {
    return 10;
  }
  
  // Beginning or end of text match
  if (normalizedText.startsWith(normalizedToken + ' ') || 
      normalizedText.endsWith(' ' + normalizedToken)) {
    return 8;
  }
  
  // Partial word match
  if (normalizedText.includes(normalizedToken)) {
    return 6;
  }
  
  // Stem matching
  const textTokens = tokenizeText(normalizedText);
  const tokenStem = stemWord(normalizedToken);
  
  if (textTokens.some(t => stemWord(t) === tokenStem)) {
    return 5;
  }
  
  // Advanced character-level fuzzy match for detecting typos and similar words
  if (token.length >= 4) {
    const words = normalizedText.split(/\s+/);
    for (const word of words) {
      if (word.length >= 4) {
        // Check for character sequences overlap
        let commonChars = 0;
        for (let i = 0; i < token.length - 1; i++) {
          if (word.includes(token.substring(i, i + 2))) {
            commonChars++;
          }
        }
        
        // Calculate match ratio based on common character sequences
        const matchRatio = commonChars / (token.length - 1);
        if (matchRatio > 0.5) {
          return Math.floor(matchRatio * 4);
        }
      }
    }
  }
  
  return 0;
};

// Get expanded search terms based on stemming
export const expandSearchTerms = (query: string): string[] => {
  if (!query.trim()) return [];
  
  const tokens = tokenizeText(query);
  
  // Deduplicate stems
  const uniqueTerms = new Set<string>(tokens);
  
  // For each token, add its stem if not already present
  tokens.forEach(token => {
    const stem = stemWord(token);
    if (stem !== token) {
      uniqueTerms.add(stem);
    }
  });
  
  return Array.from(uniqueTerms);
};

// Score a verse based on comprehensive text matching with the query
export const scoreVerse = (verse: Verse, searchTokens: string[]): number => {
  if (!verse.translation) return 0;
  
  const verseText = verse.translation;
  let score = 0;
  let matchedTokens = 0;
  
  // Score each search token against the verse text
  for (const token of searchTokens) {
    const tokenScore = calculateFuzzyMatchScore(token, verseText);
    
    if (tokenScore > 0) {
      matchedTokens++;
      score += tokenScore;
      
      // Bonus for longer token matches (more specific)
      if (token.length > 4) {
        score += token.length / 2;
      }
    }
  }
  
  // No matches, return zero score
  if (matchedTokens === 0) return 0;
  
  // Bonus for matching multiple tokens (more relevant matches)
  if (matchedTokens > 1) {
    score += matchedTokens * 5;
    
    // Check for phrase matches (tokens appearing close together)
    const normalizedText = normalizeText(verseText);
    let phraseBonus = 0;
    
    // Check pairs of matched tokens for proximity
    const matchedTokensList = searchTokens.filter(token => 
      calculateFuzzyMatchScore(token, verseText) > 0);
    
    for (let i = 0; i < matchedTokensList.length; i++) {
      for (let j = i + 1; j < matchedTokensList.length; j++) {
        const token1 = matchedTokensList[i];
        const token2 = matchedTokensList[j];
        
        // Find positions of both tokens in the text
        const pos1 = normalizedText.indexOf(token1);
        const pos2 = normalizedText.indexOf(token2);
        
        if (pos1 >= 0 && pos2 >= 0) {
          const distance = Math.abs(pos1 - pos2);
          // Tokens appearing close together get a proximity bonus
          if (distance < 30) {
            phraseBonus += Math.max(10 - Math.floor(distance / 3), 0);
          }
        }
      }
    }
    
    score += phraseBonus;
  }
  
  // Apply a threshold to eliminate poor matches
  return score < 5 ? 0 : Math.min(score, 100);
};

// Interface for search result with score
export interface ScoredSearchResult extends Verse {
  score: number;
}

// Main search function with improved search algorithm
export const searchVerses = (verses: Verse[], query: string): Verse[] => {
  if (!query.trim() || !verses || verses.length === 0) return [];
  
  // Prepare search tokens from the query
  const searchTokens = tokenizeText(query);
  
  // Skip very common or short search terms
  const filteredTokens = searchTokens.filter(token => token.length > 2);
  
  if (filteredTokens.length === 0) {
    // Fall back to original tokens if all were filtered
    filteredTokens.push(...searchTokens);
  }
  
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
