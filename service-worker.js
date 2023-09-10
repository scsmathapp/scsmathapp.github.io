// service-worker.js
// Define a unique cache name for your app
const cacheName = 'scsmath-app-cache-v3.1';

// List of static assets to cache when the service worker is installed
const staticAssets = [
  // Add paths to your app's static assets here
  '/index.html',
  '/build/bundle.js',
  '/build/bundle.js.map',
  '/build/bundle.css',
  '/global.css'
];

// Install event: Cache static assets when the service worker is installed
self.addEventListener('install', (event) => {
  console.log('Service worker installing');
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('Service worker installed');
      return cache.addAll(staticAssets);
    })
  );
});

// Activate event: Remove old caches if a new version of the service worker is activated
self.addEventListener('activate', (event) => {
  console.log('Service worker activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log('Service worker activated');
      return Promise.all(
        cacheNames.filter((name) => name !== cacheName).map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch event: Intercept and respond to fetch requests
self.addEventListener('fetch', (event) => {
  console.log('Service worker fetching');
  event.respondWith(
    // Try to fetch the request from the cache
    caches.match(event.request).then((response) => {
      // If the request is in the cache, return the cached response
      if (response) {
        console.log('Loading cached version');
        return response;
      }

      // If the request is not in the cache, fetch it from the network
      return fetch(event.request).then((networkResponse) => {
        console.log('Fetching from web');
        // Cache a copy of the response for future use
        caches.open(cacheName).then((cache) => {
          console.log('Registering new cache');
          cache.put(event.request, networkResponse.clone());
        });

        // Return the network response to the page
        return networkResponse;
      }).catch((error) => {
        // Handle fetch errors (e.g., offline) gracefully
        console.error('Fetch error:', error);

        // You can customize the offline response here
        return new Response('You are offline.', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
