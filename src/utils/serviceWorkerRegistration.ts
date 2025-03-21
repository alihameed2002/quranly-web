/**
 * Service worker registration utility
 * This file handles registering and updating the service worker for offline capabilities
 */

// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: (registration: ServiceWorkerRegistration) => void;
};

// Check if we're in a browser environment
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

/**
 * Checks if the service worker can be registered in the current environment
 */
export function canRegisterServiceWorker(): boolean {
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers are not supported by this browser');
    return false;
  }
  
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    console.log('Service worker will not be registered in development mode');
    return false;
  }
  
  return true;
}

/**
 * Registers a service worker for production environments
 */
export function register(config?: Config): void {
  if (!canRegisterServiceWorker()) {
    return;
  }

  // The URL constructor is available in all browsers that support SW.
  const publicUrl = new URL(
    process.env.PUBLIC_URL || window.location.href,
    window.location.href
  );
  
  // Our service worker won't work if PUBLIC_URL is on a different origin
  // from what our page is served on. This might happen if a CDN is used to
  // serve assets; see https://github.com/facebook/create-react-app/issues/2374
  if (publicUrl.origin !== window.location.origin) {
    console.log(
      'Skipping service worker registration because PUBLIC_URL is on a different origin from the current page'
    );
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = `${process.env.PUBLIC_URL || ''}/service-worker.js`;

    if (isLocalhost) {
      // This is running on localhost. Let's check if a service worker still exists or not.
      checkValidServiceWorker(swUrl, config);

      // Add some additional logging to localhost, pointing developers to the
      // service worker/PWA documentation.
      navigator.serviceWorker.ready.then(() => {
        console.log(
          'This web app is being served cache-first by a service ' +
            'worker. To learn more, visit https://cra.link/PWA'
        );
      });
    } else {
      // Is not localhost. Just register service worker
      registerValidSW(swUrl, config);
    }
  });
}

/**
 * Registers a valid service worker
 */
function registerValidSW(swUrl: string, config?: Config): void {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // Check if we're offline at start
      if (!navigator.onLine && config?.onOffline) {
        config.onOffline(registration);
      }
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://cra.link/PWA.'
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
      
      // Set up event listeners for online/offline events
      window.addEventListener('online', () => {
        console.log('App is online. Syncing data...');
        // Send message to service worker that we're back online
        registration.active?.postMessage({ type: 'ONLINE_STATUS', status: 'online' });
      });
      
      window.addEventListener('offline', () => {
        console.log('App is offline. Using cached data...');
        if (config?.onOffline) {
          config.onOffline(registration);
        }
        // Notify service worker we're offline
        registration.active?.postMessage({ type: 'ONLINE_STATUS', status: 'offline' });
      });
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

/**
 * Validates that the service worker exists at the provided URL
 */
function checkValidServiceWorker(swUrl: string, config?: Config): void {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
      if (config?.onOffline) {
        navigator.serviceWorker.ready.then((registration) => {
          config.onOffline?.(registration);
        });
      }
    });
}

/**
 * Checks for service worker updates
 */
export function checkForUpdates(callback?: (registration: ServiceWorkerRegistration) => void): void {
  if (!('serviceWorker' in navigator)) {
    return;
  }
  
  navigator.serviceWorker.ready
    .then((registration) => {
      registration.update()
        .then(() => {
          console.log('Service worker checked for updates');
          if (callback) callback(registration);
        })
        .catch((error) => {
          console.error('Error checking for service worker updates:', error);
        });
    })
    .catch((error) => {
      console.error('Error accessing service worker registration:', error);
    });
}

/**
 * Unregisters the service worker
 */
export function unregister(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('Error unregistering service worker:', error);
      });
  }
}

/**
 * Asks the service worker to skip waiting and activate immediately
 */
export function applyUpdate(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('serviceWorker' in navigator)) {
      reject(new Error('Service worker not supported'));
      return;
    }
    
    navigator.serviceWorker.ready
      .then((registration) => {
        if (!registration.waiting) {
          reject(new Error('No waiting service worker found'));
          return;
        }
        
        // Send skipWaiting message
        registration.waiting.postMessage('skipWaiting');
        
        // Reload the page to apply the update
        window.location.reload();
        resolve();
      })
      .catch(reject);
  });
}

/**
 * Clears the cache managed by the service worker
 */
export function clearCache(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('serviceWorker' in navigator)) {
      reject(new Error('Service worker not supported'));
      return;
    }
    
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.active?.postMessage('clearCache');
        console.log('Cache clear request sent to service worker');
        resolve();
      })
      .catch((error) => {
        console.error('Error sending cache clear request:', error);
        reject(error);
      });
  });
}

/**
 * Returns the current online/offline status
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

// Send message to the service worker
export function sendMessageToSW(message: any): void {
  if (!('serviceWorker' in navigator)) return;
  
  navigator.serviceWorker.ready.then((registration) => {
    if (registration.active) {
      registration.active.postMessage(message);
    }
  });
}

// Check if the app is running in offline mode
export async function checkOfflineStatus(): Promise<boolean> {
  return !navigator.onLine;
}

// Manual refresh to update service worker
export function forceRefresh(): void {
  if (!('serviceWorker' in navigator)) return;
  
  navigator.serviceWorker.ready.then((registration) => {
    // Send a message to skip waiting for the new service worker
    sendMessageToSW({ type: 'SKIP_WAITING' });
    
    // Reload the page to activate the new service worker
    window.location.reload();
  });
}

// Called from your application's main entry point to register the service worker
export function initServiceWorker(): void {
  // Only register service worker in production
  if (process.env.NODE_ENV === 'production') {
    // Register when the window loads to avoid impacting page load time
    window.addEventListener('load', () => {
      register();
    });
  }
} 