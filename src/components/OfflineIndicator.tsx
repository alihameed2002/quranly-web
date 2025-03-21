'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  
  useEffect(() => {
    // Set initial state
    setIsOffline(!navigator.onLine);
    
    // Add event listeners for online/offline events
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);
  
  if (!isOffline) return null;
  
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-auto z-50">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg shadow-md flex items-center">
        <WifiOff className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">You are currently offline</span>
      </div>
    </div>
  );
} 