// service-worker.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.3.0/workbox-sw.js');

if (self.location.hostname.includes('scsmathapp.github.io') && workbox) {
  workbox.precaching.precacheAndRoute([
    // Add paths to your app's static assets here
    '/index.html',
    '/build/bundle.js',
    '/build/bundle.js.map',
    '/build/bundle.css',
    '/global.css'
  ]);

  // Cache images and PDFs in a specific subfolder
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/assets/'),
    new workbox.strategies.CacheFirst()
  );

  // Additional caching strategies and routes can be configured here
}
