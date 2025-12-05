const CACHE_NAME = 'khai-routine-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './goals.html',
  './focus.html',
  './clarity.html',
  './streak.html',
  './physical.html',
  './academic.html',
  './financial.html',
  './spiritual.html',
  './emotional.html',
  './manifest.json',
  './icon.png'
];

// Install event: caches files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Fetch event: serves files from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});