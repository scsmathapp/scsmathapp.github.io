// service-worker.js
// Define a unique cache name for your app
const cacheName = 'scsmath-app-cache-v3';

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
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(staticAssets);
    })
  );
});

// Activate event: Remove old caches if a new version of the service worker is activated
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== cacheName).map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch event: Intercept and respond to fetch requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Try to fetch the request from the cache
    caches.match(event.request).then((response) => {
      // If the request is in the cache, return the cached response
      if (response) {
        return response;
      }

      // If the request is not in the cache, fetch it from the network
      return fetch(event.request).then((networkResponse) => {
        // Cache a copy of the response for future use
        caches.open(cacheName).then((cache) => {
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
