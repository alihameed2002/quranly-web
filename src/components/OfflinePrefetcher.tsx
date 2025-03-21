'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { fetchHadithCollections } from '@/lib/hadithDataFetching';
import { fetchQuranData, fetchSurahs, fetchSurahVerses } from '@/lib/quranDataFetching';
import { checkOfflineDataAvailability, storeOfflineData, clearOfflineData } from '@/utils/offlineStorage';
import { Cloud, Download, CheckCircle, WifiOff, AlertCircle, RefreshCw, Trash } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

export default function OfflinePrefetcher() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Function to check offline data status
  const checkDataStatus = async () => {
    try {
      const hasData = await checkOfflineDataAvailability();
      setHasOfflineData(hasData);
      console.log('Offline data available:', hasData);
      
      // If we have offline data, clean it up to ensure no unwanted HTML/footnotes
      if (hasData) {
        cleanExistingData();
      }
      
      return hasData;
    } catch (err) {
      console.error('Error checking offline data:', err);
      setHasOfflineData(false);
      return false;
    }
  };

  // Clean up existing cached data by removing HTML tags and footnotes from translations
  const cleanExistingData = async () => {
    try {
      // Get all verses from IndexedDB
      const dbName = 'quranlyOfflineDB';
      const storeName = 'verses';
      
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = window.indexedDB.open(dbName);
        request.onerror = () => reject(new Error('Could not open database'));
        request.onsuccess = () => resolve(request.result);
      });
      
      // Get all verses
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const allVerses = await new Promise<any[]>((resolve, reject) => {
        const request = store.getAll();
        request.onerror = () => reject(new Error('Could not get verses'));
        request.onsuccess = () => resolve(request.result);
      });
      
      // Only process if we have verses
      if (allVerses && allVerses.length > 0) {
        console.log(`Cleaning ${allVerses.length} verses to remove unwanted HTML tags and footnotes`);
        
        // Check if there's anything to clean by looking for HTML tags or footnote patterns
        const hasUnwantedContent = allVerses.some(verse => 
          verse.translation && (
            verse.translation.includes('<sup') ||
            verse.translation.includes('foot_note') ||
            verse.translation.includes('[') ||
            verse.translation.includes('(')
          )
        );
        
        if (hasUnwantedContent) {
          // Clean each verse and save it back
          let updated = 0;
          
          for (const verse of allVerses) {
            if (verse.translation) {
              const originalText = verse.translation;
              
              // Remove <sup> tags and their content
              let cleaned = originalText.replace(/<sup[^>]*>.*?<\/sup>/g, '');
              
              // Remove footnote references in various formats
              cleaned = cleaned.replace(/<sup foot_note=\d+>\d+<\/sup>/g, '');
              cleaned = cleaned.replace(/\[\d+\]/g, ''); // Remove [1], [2], etc.
              cleaned = cleaned.replace(/\(\d+\)/g, ''); // Remove (1), (2), etc.
              
              // Remove other HTML tags that might be present
              cleaned = cleaned.replace(/<[^>]*>/g, '');
              
              // Clean up extra spaces
              cleaned = cleaned.replace(/\s+/g, ' ').trim();
              
              // Only update if the text actually changed
              if (cleaned !== originalText) {
                verse.translation = cleaned;
                updated++;
                
                // Save the updated verse
                const updateRequest = store.put(verse);
                updateRequest.onerror = () => console.error(`Failed to update verse ${verse.id}`);
              }
            }
          }
          
          // Wait for transaction to complete
          await new Promise<void>((resolve, reject) => {
            transaction.oncomplete = () => {
              console.log(`Updated ${updated} verses to remove unwanted content`);
              resolve();
            };
            transaction.onerror = () => reject(new Error('Transaction failed'));
          });
          
          if (updated > 0) {
            // Show toast notification about the cleanup
            toast({
              title: "Data Optimized",
              description: `Removed footnotes from ${updated} verse translations`,
              variant: "default",
              duration: 3000,
            });
          }
        } else {
          console.log('No unwanted content found in cached verses');
        }
      }
      
      db.close();
    } catch (err) {
      console.error('Error cleaning existing data:', err);
    }
  };

  useEffect(() => {
    const checkOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      console.log('Online status:', online);
    };

    // Check initial status
    checkOnlineStatus();
    checkDataStatus();

    // Set up event listeners
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);

    return () => {
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
    };
  }, []);

  const prefetchData = async () => {
    if (!isOnline) {
      setError('You need to be online to download data for offline use');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setProgress(0);

      // Step 1: Fetch Surah list (5% of progress)
      setProgress(1);
      const surahs = await fetchSurahs();
      setProgress(5);
      
      if (!surahs || surahs.length === 0) {
        throw new Error('Failed to fetch surah list');
      }
      
      console.log(`Successfully fetched ${surahs.length} surahs`);
      
      // Step 2: Fetch Quran verses (5% to 50% of progress)
      const verses: Record<number, any> = {};
      const totalSurahs = surahs.length;
      
      // We'll fetch verses for each surah in sequence to ensure we don't overwhelm the API
      for (let i = 0; i < totalSurahs; i++) {
        try {
          const surah = surahs[i];
          const progressIncrement = 45 / totalSurahs;
          
          setProgress(5 + (i * progressIncrement));
          console.log(`Fetching verses for surah ${surah.number} (${i+1}/${totalSurahs})`);
          
          const surahVerses = await fetchSurahVerses(surah.number);
          if (surahVerses && surahVerses.length > 0) {
            verses[surah.number] = surahVerses;
            console.log(`Fetched ${surahVerses.length} verses for surah ${surah.number}`);
          }
        } catch (verseError) {
          console.error(`Error fetching verses for surah ${i+1}:`, verseError);
          // Continue with the next surah even if this one fails
        }
        
        // Store progress update periodically
        if (i % 10 === 0 || i === totalSurahs - 1) {
          try {
            await storeOfflineData({
              quran: {
                surahs,
                verses
              },
              hadith: {}
            });
            console.log(`Saved progress after surah ${i+1}`);
          } catch (saveError) {
            console.error('Error saving partial Quran data:', saveError);
          }
        }
      }
      
      setProgress(50);
      
      // Step 3: Fetch Hadith collections (50% to 95% of progress)
      setProgress(55);
      const hadithCollections = await fetchHadithCollections();
      setProgress(95);
      
      if (!hadithCollections || !hadithCollections.collections || hadithCollections.collections.length === 0) {
        console.warn('No hadith collections fetched, but continuing with Quran data');
      } else {
        console.log(`Successfully fetched ${hadithCollections.collections.length} hadith collections`);
      }
      
      // Step 4: Store all data in IndexedDB
      const quranData = {
        surahs,
        verses
      };
      
      await storeOfflineData({
        quran: quranData,
        hadith: hadithCollections
      });
      
      setProgress(100);
      await checkDataStatus(); // Updates the UI state
      
      // Show success message
      toast({
        title: "Download Complete",
        description: "All data has been downloaded for offline use.",
        variant: "default",
      });
    } catch (err) {
      console.error('Error prefetching data:', err);
      
      // Try to get a useful error message
      let errorMessage = 'Failed to download offline data';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Check if we have any partial data saved
      await checkDataStatus();
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearData = async () => {
    try {
      setIsLoading(true);
      await clearOfflineData();
      setHasOfflineData(false);
      toast({
        title: "Data Cleared",
        description: "All offline data has been removed.",
        variant: "default",
      });
    } catch (err) {
      console.error('Error clearing offline data:', err);
      toast({
        title: "Error",
        description: "Failed to clear offline data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshData = async () => {
    // Clear existing data first
    await clearData();
    // Then download fresh data
    await prefetchData();
  };

  if (!isOnline && !hasOfflineData) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>You're offline</AlertTitle>
        <AlertDescription>
          Connect to the internet to download Quran and Hadith data for offline use.
        </AlertDescription>
      </Alert>
    );
  }

  if (hasOfflineData) {
    return (
      <div className="space-y-4">
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Offline data available</AlertTitle>
          <AlertDescription>
            Quran and Hadith data has been downloaded and is available for offline use.
          </AlertDescription>
        </Alert>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData} 
            disabled={isLoading || !isOnline}
            className="flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearData} 
            disabled={isLoading}
            className="flex-1"
          >
            <Trash className="h-4 w-4 mr-2" />
            Clear Data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-4">
      <Alert>
        <Cloud className="h-4 w-4" />
        <AlertTitle>Download data for offline use</AlertTitle>
        <AlertDescription>
          Download the Quran and Hadith collections to use the app without an internet connection.
          This requires approximately 10-15MB of storage space.
        </AlertDescription>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3" 
          onClick={prefetchData} 
          disabled={isLoading || !isOnline}
        >
          {isLoading ? (
            <>Downloading... {Math.round(progress)}%</>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download
            </>
          )}
        </Button>
      </Alert>

      {isLoading && (
        <Progress value={progress} className="w-full h-2" />
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 