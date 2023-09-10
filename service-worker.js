// service-worker.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.3.0/workbox-sw.js');

if (self.location.hostname.includes('scsmathapp.github.io') && workbox) {
  const cacheName = 'scsmath-app-cache-v2.1';

  workbox.precaching.precacheAndRoute([
    // Add paths to your app's static assets here
    '/index.html',
    '/build/bundle.js',
    '/build/bundle.js.map',
    '/build/bundle.css',
    '/global.css'
  ]);

  // Clean previous version
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((cache) => cache !== cacheName).map((cache) => caches.delete(cache))
        );
      })
    );
  });

  // Cache images and PDFs in a specific subfolder
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/assets/'),
    new workbox.strategies.CacheFirst({
      cacheName: cacheName
    })
  );

  // Additional caching strategies and routes can be configured here
}
