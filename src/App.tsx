import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import QuranReading from "./pages/quran/Reading";
import QuranExplore from "./pages/quran/Explore";
import SunnahReading from "./pages/sunnah/Reading";
import SunnahExplore from "./pages/sunnah/Explore";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import OfflineIndicator from "./components/OfflineIndicator";
import OfflinePrefetcher from "./components/OfflinePrefetcher";
import { register, unregister } from "./utils/serviceWorkerRegistration";
import { toast } from "./components/ui/use-toast";
import { Button } from "./components/ui/button";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      // Add staleTime to reduce network requests
      staleTime: 1000 * 60 * 10, // 10 minutes
      // Add cache lifetime
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    }
  }
});

const App = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Register service worker
    register({
      onSuccess: (registration) => {
        console.log('Service worker registered successfully');
        toast({
          title: "Offline Ready",
          description: "App is now available offline. Download data in Settings for full experience.",
          duration: 5000,
        });
      },
      onUpdate: (registration) => {
        console.log('New version available');
        setIsUpdateAvailable(true);
        toast({
          title: "Update Available",
          description: "A new version is available. Refresh to update.",
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                // Send skip waiting message to the service worker
                if (registration.waiting) {
                  registration.waiting.postMessage('skipWaiting');
                }
                window.location.reload();
              }}
            >
              Refresh
            </Button>
          ),
          duration: 0, // Don't auto-dismiss
        });
      },
      onOffline: () => {
        setIsOffline(true);
        toast({
          title: "You're Offline",
          description: "Using cached data. Some features may be limited.",
          duration: 3000,
        });
      }
    });

    // Listen for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <OfflineIndicator />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/quran/reading" element={<QuranReading />} />
            <Route path="/quran/explore" element={<QuranExplore />} />
            <Route path="/sunnah/reading" element={<SunnahReading />} />
            <Route path="/sunnah/explore" element={<SunnahExplore />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
