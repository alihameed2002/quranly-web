import { Verse } from './quranData';

// Arabic root patterns and common forms
const arabicRoots: Record<string, string[]> = {
  "سلم": ["سلام", "إسلام", "مسلم", "سليم", "تسليم", "استسلام", "سالم"],
  "علم": ["علم", "عليم", "معلوم", "تعليم", "علماء", "عالم", "معلم"],
  "رحم": ["رحمن", "رحيم", "رحمة", "مرحمة", "رحماء", "ترحم", "راحم"],
  // Add more Arabic roots as needed
};

// Expanded map of common Islamic/Quranic terms and their synonyms 
const synonymMap: Record<string, string[]> = {
  // Original mappings from your code
  "god": ["allah", "lord", "creator", "divine", "deity", "almighty"],
  "allah": ["god", "lord", "creator", "divine", "deity", "almighty"],
  "mercy": ["compassion", "forgiveness", "kindness", "grace", "clemency", "benevolence", "rahma", "rahman", "rahim"],
  "forgiveness": ["mercy", "pardon", "clemency", "absolution", "forgive", "forgiving", "ghafoor", "ghaffar"],
  // Your other existing mappings
  
  // Additional theological concepts
  "monotheism": ["oneness", "tawhid", "unity", "one god", "monothestic"],
  "sin": ["transgression", "disobedience", "error", "wrongdoing", "wrong", "fault", "misdeed", "iniquity", "violation"],
  "revelation": ["wahy", "inspiration", "disclosed", "revealed", "unveiling", "tanzil"],
  "hypocrite": ["munafiq", "pretender", "dissembler", "two-faced", "insincere"],
  
  // Historical references
  "battle": ["war", "fighting", "combat", "conflict", "warfare", "jihad", "struggle", "ghazwa"],
  "mecca": ["makka", "bakkah", "sacred house", "kaaba"],
  "medina": ["yathrib", "madinah", "city of the prophet"],
  
  // Scholarly terms
  "exegesis": ["tafsir", "interpretation", "explanation", "commentary", "elucidation"],
  "jurisprudence": ["fiqh", "islamic law", "sharia", "legal rulings"],
};

// Contextual theme mapping - groups related concepts that often appear together
const thematicMap: Record<string, string[]> = {
  "prayer_ritual": ["prayer", "salah", "worship", "bow", "prostration", "ablution", "mosque"],
  "day_of_judgment": ["judgment", "resurrection", "qiyamah", "last day", "hereafter", "akhirah", "scale", "reckoning"],
  "prophethood": ["prophet", "messenger", "revelation", "scripture", "mission", "warner", "bearer of good news"],
  "moral_character": ["character", "ethics", "virtue", "kindness", "honesty", "patience", "justice", "modesty"],
};

// Enhanced phonetic matching for Arabic transliteration variations
const phoneticallyEquivalent: Record<string, string[]> = {
  "q": ["k"],
  "kh": ["k", "h"],
  "dh": ["d", "z", "th"],
  "th": ["t", "s"],
  "ai": ["ay", "i", "ei"],
  "ee": ["i", "ea", "y"],
  "ou": ["u", "oo"],
};

// Function to generate phonetic variations
const generatePhoneticVariations = (term: string): string[] => {
  const variations = new Set<string>([term]);
  
  // Handle common transliteration variations
  let newTerm = term;
  Object.entries(phoneticallyEquivalent).forEach(([sound, alternatives]) => {
    if (term.includes(sound)) {
      alternatives.forEach(alt => {
        variations.add(term.replace(new RegExp(sound, 'g'), alt));
      });
    }
  });

  return Array.from(variations);
};

// Enhanced function to get all possible search terms including synonyms, roots, themes and phonetic variations
export const expandSearchTerms = (query: string): string[] => {
  // Normalize query and split into individual terms
  const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
  const expandedTerms = new Set<string>();
  
  // Add original terms
  terms.forEach(term => expandedTerms.add(term));
  
  // Process each term
  terms.forEach(term => {
    // Add the original term
    expandedTerms.add(term);
    
    // Add phonetic variations of the term
    generatePhoneticVariations(term).forEach(variation => {
      expandedTerms.add(variation);
    });
    
    // Check for exact matches in the synonym map
    if (synonymMap[term]) {
      synonymMap[term].forEach(synonym => expandedTerms.add(synonym));
    }
    
    // Check Arabic roots (if term is in Arabic or a known transliteration)
    Object.entries(arabicRoots).forEach(([root, forms]) => {
      if (forms.includes(term)) {
        // Add all forms from the same root
        forms.forEach(form => expandedTerms.add(form));
      }
    });
    
    // Check for thematic relationships
    Object.entries(thematicMap).forEach(([theme, relatedTerms]) => {
      if (relatedTerms.includes(term)) {
        // Add all related terms in the same theme
        relatedTerms.forEach(related => expandedTerms.add(related));
      }
    });
    
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

// Enhanced fuzzy matching with Levenshtein distance calculation
const calculateLevenshteinDistance = (a: string, b: string): number => {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }

  return matrix[b.length][a.length];
};

// Improved string matching with Levenshtein distance for fuzzy matching
const textContainsTerm = (text: string, term: string): {matches: boolean, quality: number} => {
  const normalizedText = text.toLowerCase();
  const normalizedTerm = term.toLowerCase();
  let quality = 0;
  
  // Exact match
  if (normalizedText.includes(normalizedTerm)) {
    quality = 10;
    return { matches: true, quality };
  }
  
  // Check for word boundaries
  const wordBoundaryRegex = new RegExp(`\\b${normalizedTerm}\\b`, 'i');
  if (wordBoundaryRegex.test(normalizedText)) {
    quality = 9;
    return { matches: true, quality };
  }
  
  // For short terms (3 chars or less), require more exact matches
  if (normalizedTerm.length <= 3) {
    return { matches: normalizedText.includes(normalizedTerm), quality: 7 };
  }
  
  // For longer terms, try stemming (simplified version - remove common endings)
  const stemmed = normalizedTerm
    .replace(/ing$|ed$|es$|s$/, '')
    .replace(/ers$|er$/, '');
  
  if (stemmed !== normalizedTerm && normalizedText.includes(stemmed)) {
    quality = 6;
    return { matches: true, quality };
  }
  
  // For terms longer than 5 chars, allow partial matching (beginning of words)
  if (normalizedTerm.length > 5) {
    const words = normalizedText.split(/\s+/);
    const partialMatch = words.some(word => word.startsWith(normalizedTerm) || normalizedTerm.startsWith(word));
    if (partialMatch) {
      quality = 5;
      return { matches: true, quality };
    }
  }
  
  // Fuzzy matching with Levenshtein distance for longer terms
  if (normalizedTerm.length >= 4) {
    const words = normalizedText.split(/\s+/);
    for (const word of words) {
      if (word.length >= 4) {
        const distance = calculateLevenshteinDistance(word, normalizedTerm);
        // Allow for some fuzzy matching based on word length
        const threshold = Math.floor(normalizedTerm.length / 3);
        if (distance <= threshold) {
          quality = 4 - (distance / threshold); // Lower quality with greater distance
          return { matches: true, quality };
        }
      }
    }
  }
  
  return { matches: false, quality: 0 };
};

// Enhanced scoring function that accounts for match quality and context
export const scoreVerse = (verse: Verse, searchTerms: string[]): number => {
  // Ensure we have a translation to search in
  const text = verse.translation?.toLowerCase() || "";
  const arabicText = verse.arabicText?.toLowerCase() || "";
  
  if (!text && !arabicText) return 0;
  
  let score = 0;
  const matchedTerms = new Set<string>();
  const matchQuality: Record<string, number> = {};
  
  // Check each search term
  searchTerms.forEach(term => {
    // Skip very short terms unless they're exact matches
    if (term.length < 3 && !text.includes(` ${term} `)) {
      return;
    }
    
    // Look for matches in translation
    const translationMatch = textContainsTerm(text, term);
    if (translationMatch.matches) {
      // Direct match with quality factor
      score += 10 * translationMatch.quality / 10;
      matchedTerms.add(term);
      matchQuality[term] = Math.max(matchQuality[term] || 0, translationMatch.quality);
      
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
    
    // Also check in Arabic text if available
    if (arabicText) {
      const arabicMatch = textContainsTerm(arabicText, term);
      if (arabicMatch.matches) {
        // Arabic matches are highly valuable
        score += 15 * arabicMatch.quality / 10;
        matchedTerms.add(term);
        matchQuality[term] = Math.max(matchQuality[term] || 0, arabicMatch.quality);
      }
    }
  });
  
  // Boost score based on number of unique matched terms
  if (matchedTerms.size > 1) {
    score += matchedTerms.size * 5; // Bonus for matching multiple terms
    
    // Check for term proximity - terms appearing closer together in the text
    // get a higher score (simplistic implementation)
    const termPositions: Record<string, number[]> = {};
    matchedTerms.forEach(term => {
      termPositions[term] = [];
      let pos = text.indexOf(term);
      while (pos !== -1) {
        termPositions[term].push(pos);
        pos = text.indexOf(term, pos + 1);
      }
    });
    
    // Check proximity of terms (if they're within 50 characters of each other)
    let proximityBonus = 0;
    const termsList = Array.from(matchedTerms);
    for (let i = 0; i < termsList.length; i++) {
      for (let j = i + 1; j < termsList.length; j++) {
        const term1 = termsList[i];
        const term2 = termsList[j];
        
        if (termPositions[term1] && termPositions[term2]) {
          for (const pos1 of termPositions[term1]) {
            for (const pos2 of termPositions[term2]) {
              const distance = Math.abs(pos1 - pos2);
              if (distance < 50) {
                proximityBonus += 5 * (1 - distance/50);
              }
            }
          }
        }
      }
    }
    score += proximityBonus;
  }
  
  // Factor in the overall quality of matches
  const avgQuality = Object.values(matchQuality).reduce((sum, q) => sum + q, 0) / 
                    Object.values(matchQuality).length;
  score *= (avgQuality / 10) * 1.5;
  
  // Context boosting: specific topics or themes mentioned in verse metadata
  if (verse.topics && matchedTerms.size > 0) {
    // If the verse has topic metadata that matches any search term
    const verseTopics = verse.topics.map(t => t.toLowerCase());
    matchedTerms.forEach(term => {
      if (verseTopics.some(topic => topic.includes(term) || term.includes(topic))) {
        score += 15; // Significant boost for topical relevance
      }
    });
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
  
  // Boost notable verses (if you have a list of commonly cited or
  // Boost notable verses (if you have a list of commonly cited or important verses)
  if (verse.isNotable) {
    score *= 1.2; // 20% bonus for notable verses
  }
  
  // Timeline context - if searching for historical events
  if (verse.revelationPeriod && matchedTerms.has("battle")) {
    if (verse.revelationPeriod === "medinan") {
      score += 10; // More battles occurred in the Medinan period
    }
  }

  return Math.round(score * 10) / 10; // Round to 1 decimal place
};

// Interface for search results with additional metadata
export interface ScoredSearchResult extends Verse {
  score: number;
  matchedTerms?: string[];
  relevanceExplanation?: string;
}

// Helper function to extract data from collection of verses for search
export const prepareVersesForSearch = (verses: Verse[]): Verse[] => {
  return verses.map(verse => ({
    ...verse,
    // Ensure the translation is usable for search
    translation: verse.translation || "",
    // Prepare additional fields for search optimization
    searchText: `${verse.translation || ""} ${verse.transliteration || ""} ${verse.topics?.join(" ") || ""}`.toLowerCase()
  }));
};

// Main search function with improved algorithm
export const searchVerses = (verses: Verse[], query: string, options: SearchOptions = {}): ScoredSearchResult[] => {
  // Return empty array for empty queries
  if (!query.trim()) return [];
  
  const searchTerms = expandSearchTerms(query);
  const scoredResults: ScoredSearchResult[] = [];
  
  // Default options
  const defaultOptions: SearchOptions = {
    maxResults: 50,
    minScore: 5,
    includeMetadata: true,
    filterBySurah: null,
    filterByJuz: null,
    sortByRelevance: true
  };
  
  // Merge provided options with defaults
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Check if we have verses to search
  if (!verses || verses.length === 0) {
    console.warn("No verses provided for search");
    return [];
  }
  
  // Pre-filter verses if needed to improve performance
  let searchableVerses = verses;
  if (mergedOptions.filterBySurah !== null) {
    searchableVerses = searchableVerses.filter(v => v.surahNumber === mergedOptions.filterBySurah);
  }
  if (mergedOptions.filterByJuz !== null) {
    searchableVerses = searchableVerses.filter(v => v.juzNumber === mergedOptions.filterByJuz);
  }
  
  // Score each verse
  searchableVerses.forEach(verse => {
    const score = scoreVerse(verse, searchTerms);
    if (score >= mergedOptions.minScore) {
      // Track which terms matched for this verse
      const matchedTerms = searchTerms.filter(term => 
        textContainsTerm(verse.translation || "", term).matches ||
        (verse.arabicText && textContainsTerm(verse.arabicText, term).matches)
      );
      
      const result: ScoredSearchResult = {
        ...verse, 
        score,
        matchedTerms
      };
      
      // Add explanation of relevance if requested
      if (mergedOptions.includeMetadata) {
        result.relevanceExplanation = generateRelevanceExplanation(verse, score, matchedTerms);
      }
      
      scoredResults.push(result);
    }
  });
  
  // Debugging
  console.log(`Search for "${query}" found ${scoredResults.length} results`);
  console.log("Search terms expanded to:", searchTerms);
  
  // Log sample results for debugging
  if (scoredResults.length > 0) {
    console.log("Top 3 results with scores:");
    scoredResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .forEach((result, idx) => {
        console.log(`${idx+1}. Score ${result.score}: "${result.translation?.substring(0, 100)}..."`);
        if (result.matchedTerms) {
          console.log(`   Matched terms: ${result.matchedTerms.join(", ")}`);
        }
      });
  }
  
  // Sort by score (highest first) if requested
  if (mergedOptions.sortByRelevance) {
    scoredResults.sort((a, b) => b.score - a.score);
  }
  
  // Limit the number of results if specified
  const limitedResults = mergedOptions.maxResults ? 
    scoredResults.slice(0, mergedOptions.maxResults) : 
    scoredResults;
  
  // Return based on metadata preference
  if (mergedOptions.includeMetadata) {
    return limitedResults;
  } else {
    // Return without the additional metadata
    return limitedResults.map(({score, matchedTerms, relevanceExplanation, ...verse}) => ({...verse, score}));
  }
};

// Helper function to generate human-readable relevance explanation
function generateRelevanceExplanation(verse: Verse, score: number, matchedTerms: string[]): string {
  if (matchedTerms.length === 0) return "Matched through contextual relevance";
  
  if (matchedTerms.length === 1) {
    return `Contains the term '${matchedTerms[0]}'`;
  }
  
  if (matchedTerms.length <= 3) {
    return `Contains the terms: ${matchedTerms.join(', ')}`;
  }
  
  return `Matches ${matchedTerms.length} search terms including '${matchedTerms[0]}', '${matchedTerms[1]}', and others`;
}

// Search options interface
interface SearchOptions {
  maxResults?: number;        // Maximum number of results to return
  minScore?: number;          // Minimum score threshold
  includeMetadata?: boolean;  // Whether to include explanation metadata
  filterBySurah?: number | null;  // Filter by surah number
  filterByJuz?: number | null;    // Filter by juz number
  sortByRelevance?: boolean;  // Whether to sort by relevance score
}

// Advanced usage: search with contextual query understanding
export const advancedSearch = (verses: Verse[], queryText: string, context?: SearchContext): ScoredSearchResult[] => {
  // Analyze the query to detect intent and context
  const queryAnalysis = analyzeSearchQuery(queryText);
  
  // Set up search options based on analysis
  const searchOptions: SearchOptions = {
    minScore: queryAnalysis.isSpecific ? 3 : 5, // Lower threshold for specific queries
    includeMetadata: true
  };
  
  // Apply contextual filters if provided
  if (context?.currentSurah) {
    searchOptions.filterBySurah = context.currentSurah;
  }
  
  if (context?.preferredTranslation) {
    // Filter verses to preferred translation if available
    verses = verses.filter(v => v.translationSource === context.preferredTranslation);
  }
  
  // Execute search with enhanced options
  return searchVerses(verses, queryText, searchOptions);
};

// Context options for searches
interface SearchContext {
  currentSurah?: number;
  currentJuz?: number;
  preferredTranslation?: string;
  searchHistory?: string[];
  userProfile?: {
    interests?: string[];
    readingLevel?: 'beginner' | 'intermediate' | 'advanced';
  };
}

// Helper to analyze query intent
function analyzeSearchQuery(query: string): {
  isQuestion: boolean;
  isSpecific: boolean;
  topics: string[];
  entityTypes: string[];
} {
  const result = {
    isQuestion: /who|what|where|when|why|how/.test(query.toLowerCase()),
    isSpecific: query.length > 15 || /\b(exact|specific|verse about|ayah about)\b/.test(query.toLowerCase()),
    topics: [],
    entityTypes: []
  };
  
  // Extract potential topics from query
  const commonTopics = ["prayer", "faith", "charity", "fasting", "pilgrimage", "marriage", "divorce"];
  result.topics = commonTopics.filter(topic => query.toLowerCase().includes(topic));
  
  // Detect entity types being searched
  if (/\b(prophet|messenger)\b/.test(query.toLowerCase())) {
    result.entityTypes.push('prophet');
  }
  if (/\b(battle|war|ghazwa)\b/.test(query.toLowerCase())) {
    result.entityTypes.push('historical');
  }
  
  return result;
}

// Cache search results for performance
const searchCache = new Map<string, {timestamp: number, results: ScoredSearchResult[]}>();

// Cached search function for frequently used queries
export const cachedSearch = (verses: Verse[], query: string, options: SearchOptions = {}): ScoredSearchResult[] => {
  const cacheKey = `${query}_${JSON.stringify(options)}`;
  const currentTime = Date.now();
  const cachedResult = searchCache.get(cacheKey);
  
  // Use cache if available and less than 5 minutes old
  if (cachedResult && (currentTime - cachedResult.timestamp < 5 * 60 * 1000)) {
    console.log("Using cached search results");
    return cachedResult.results;
  }
  
  // Perform new search
  const results = searchVerses(verses, query, options);
  
  // Cache the results
  searchCache.set(cacheKey, {
    timestamp: currentTime,
    results
  });
  
  // Clean old cache entries
  [...searchCache.keys()].forEach(key => {
    const entry = searchCache.get(key);
    if (entry && (currentTime - entry.timestamp > 30 * 60 * 1000)) {
      searchCache.delete(key);
    }
  });
  
  return results;
};