const CACHE = 'xmarket-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.url.startsWith('http') === false) return;
  e.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
