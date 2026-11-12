const V = 'v3';
const STATIC = 'xm-static-' + V, IMG = 'xm-img-' + V, PAGES = 'xm-pages-' + V;
const IMG_HOSTS = ['res.cloudinary.com', 'img.youtube.com'];

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil((async () => {
  const keep = [STATIC, IMG, PAGES];
  const keys = await caches.keys();
  await Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k)));
  await self.clients.claim();
})()));

async function trim(name, max) {
  const c = await caches.open(name);
  const k = await c.keys();
  if (k.length > max) await Promise.all(k.slice(0, k.length - max).map((x) => c.delete(x)));
}

self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);

  // Pages: network first so deploys show up, cached copy when offline
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(PAGES).then((c) => c.put('/index.html', copy)); }
      return res;
    }).catch(() => caches.match('/index.html')));
    return;
  }

  // Built JS and CSS have hashed names, so cache first is safe
  if (u.origin === location.origin && u.pathname.startsWith('/static/')) {
    e.respondWith(caches.match(r).then((hit) => hit || fetch(r).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(STATIC).then((c) => c.put(r, copy)); }
      return res;
    })));
    return;
  }

  // Images: show the cached one at once, refresh in the background
  if (IMG_HOSTS.includes(u.hostname) || r.destination === 'image') {
    e.respondWith(caches.open(IMG).then((c) => c.match(r).then((hit) => {
      const net = fetch(r).then((res) => {
        if (res.ok || res.type === 'opaque') { c.put(r, res.clone()); trim(IMG, 250); }
        return res;
      }).catch(() => hit);
      return hit || net;
    })));
  }
  // Supabase, wallet, chat and everything else go straight to the network
});
