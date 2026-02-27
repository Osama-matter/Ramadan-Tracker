const CACHE_NAME = 'ramadan-tracker-v1';
const ASSETS = [
  './',
  './index.html',
  './site.css',
  './app.js',
  './adhkar_data.js',
  './Imge/lamp.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
