// service-worker.js
// Define a unique cache name for your app
const cacheName = 'scsmath-app-cache-v5';

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
self.addEventListener('install', (ev) => {
  console.log('Service worker installed', cacheName);

  ev.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(staticAssets);
      })
  );

  self.skipWaiting();
});

// Activate event: Remove old caches if a new version of the service worker is activated
self.addEventListener('activate', (ev) => {
  console.log('Service worker activated');

  ev.waitUntil(
    caches.keys()
      .then(keys => {
        keys.filter(key => key !== cacheName)
          .map(key => caches.delete(key))
      })
  );

  clients.claim();
});

// Fetch event: Intercept and respond to fetch requests
self.addEventListener('fetch', (ev) => {
  ev.respondWith(
    caches.match(ev.request)
    .then(cacheRes => {
      if (cacheRes === undefined) {
        return fetch(ev.request, {cache: "no-store"})
        .then((networkRes) => {
          console.log('Service worker fetched', ev.request.url);

          return caches.open(cacheName)
            .then(cache => {
              cache.put(ev.request, networkRes.clone());

              return networkRes;
            })
          });
        } else {
          return cacheRes;
        }
      })
  );
});
