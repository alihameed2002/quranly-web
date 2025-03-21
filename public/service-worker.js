// Service Worker for Quranly App
const CACHE_NAME = 'quranly-cache-v1';
const API_CACHE_NAME = 'quranly-api-cache-v1';

// Assets to cache during installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/static/css/',
  '/static/js/'
];

// Installation - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        // Cache all static assets
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(error => console.error('Service Worker installation failed:', error))
  );
});

// Activation - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  // Remove outdated caches
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              // Keep the current caches
              return cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME;
            })
            .map(cacheName => {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('Service Worker: Now ready to handle fetches!');
        // Immediately claim clients so the page doesn't need to be refreshed
        return self.clients.claim();
      })
  );
});

// Helper functions
const isApiRequest = (url) => {
  return url.pathname.startsWith('/api/') || 
    url.host.includes('api.quran.com') || 
    url.host.includes('api.sunnah.com') ||
    url.host.includes('api.alquran.cloud');
};

const isStaticAsset = (url) => {
  return url.pathname.startsWith('/static/') || 
    STATIC_ASSETS.some(asset => url.pathname.includes(asset)) ||
    ['.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2'].some(ext => 
      url.pathname.endsWith(ext)
    );
};

const isHtmlRequest = (request) => {
  return request.headers.get('accept')?.includes('text/html');
};

// Provide a fallback response for when we can't get the real data
const generateOfflineResponse = (request) => {
  // If it's an HTML request, serve the offline page
  if (isHtmlRequest(request)) {
    return caches.match('/index.html')
      .then(response => {
        return response || new Response(
          '<html><body><h1>Offline</h1><p>You are currently offline and the requested page is not available.</p></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        );
      });
  }
  
  // For API requests, return an empty data structure based on the requested endpoint
  const url = new URL(request.url);
  
  if (url.pathname.includes('/quran') || url.pathname.includes('/surah')) {
    // For Quran API requests
    return new Response(
      JSON.stringify({
        status: 'offline',
        message: 'You are offline. Please use the offline data.',
        data: {}
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } else if (url.pathname.includes('/hadith') || url.pathname.includes('/collection')) {
    // For Hadith API requests
    return new Response(
      JSON.stringify({
        status: 'offline',
        message: 'You are offline. Please use the offline data.',
        data: []
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Generic fallback for other requests
  return new Response(
    JSON.stringify({
      status: 'offline',
      message: 'You are currently offline. This data is not available.',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};

// Main fetch event handler
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin && 
      !isApiRequest(url)) {
    return;
  }
  
  // Log fetch attempts when debugging
  // console.log('Service Worker: Fetch', event.request.url);
  
  // Different strategies based on the request type
  if (isApiRequest(url)) {
    // Strategy for API requests: network first, then cache, then offline fallback
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the successful response
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(API_CACHE_NAME)
              .then(cache => cache.put(event.request, responseClone))
              .catch(err => console.error('Failed to cache API response:', err));
          }
          return response;
        })
        .catch(() => {
          console.log('Service Worker: Fetch failed, trying cache for', event.request.url);
          
          // Try to get from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                console.log('Service Worker: Serving from cache:', event.request.url);
                return cachedResponse;
              }
              
              // If not in cache, return offline fallback
              console.log('Service Worker: No cache available for', event.request.url);
              return generateOfflineResponse(event.request);
            });
        })
    );
  } else if (isStaticAsset(url)) {
    // Strategy for static assets: cache first, then network
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          return cachedResponse || fetch(event.request)
            .then(response => {
              // Cache the fetched response
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, responseClone));
              }
              return response;
            })
            .catch(error => {
              console.error('Failed to fetch static asset:', error);
              // For CSS/JS, we might want to provide a minimal fallback
              // For images, let the browser handle the error
              return new Response('/* Error loading resource */', {
                headers: { 'Content-Type': 'text/css' }
              });
            });
        })
    );
  } else if (isHtmlRequest(event.request)) {
    // Strategy for HTML requests: network first, cache as fallback
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the successful response
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => {
              // If we have a cached version, return it
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // If all else fails, return the index page
              return caches.match('/index.html');
            });
        })
    );
  } else {
    // Default strategy: network first, then cache
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Only cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try the cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If resource not in cache, return a simple offline message
              return generateOfflineResponse(event.request);
            });
        })
    );
  }
});

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    // This triggers an update when a new service worker is available
    self.skipWaiting().then(() => {
      console.log('Service Worker: skipWaiting executed');
    });
  } else if (event.data === 'clearCache') {
    // Clear caches on demand - useful for troubleshooting
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log(`Service Worker: Clearing cache ${cacheName}`);
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
}); 