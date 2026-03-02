const CACHE_NAME = 'ramadan-tracker-v2';
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

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('ramadan-tracker-') && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
});
