
import { Verse } from './quranTypes';
import { fetchFullQuranData } from './quranDataCache';
import { prepareVersesForSearch, searchVerses } from './searchUtils';

// Main search function to find verses matching a query
export const fetchSearchResults = async (query: string, maxResults = 100): Promise<Verse[]> => {
  if (!query.trim()) return [];
  
  try {
    // Get the full Quran data for search
    console.log(`Searching for: "${query}"`);
    const fullData = await fetchFullQuranData();
    
    if (fullData.length === 0) {
      console.error("No Quran data available for search");
      return [];
    }
    
    console.log(`Searching through ${fullData.length} verses`);
    
    // Ensure all verses have valid translations for search
    const preparedVerses = prepareVersesForSearch(fullData);
    
    // Perform the search
    const results = searchVerses(preparedVerses, query);
    
    console.log(`Search complete. Found ${results.length} matches`);
    
    // Limit the number of results to avoid performance issues
    return results.slice(0, maxResults);
  } catch (error) {
    console.error("Error performing search:", error);
    return [];
  }
};
