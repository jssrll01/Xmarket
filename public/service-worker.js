const V = 'v4';
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
  if (/\.supabase\.co$/.test(u.hostname) || r.headers.has('authorization') || r.headers.has('apikey') || /[?&](token|access_token|signature|sig|jwt)=/i.test(u.search)) return;

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
  if (IMG_HOSTS.includes(u.hostname) || (u.origin === location.origin && r.destination === 'image')) {
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

/* ---- web push ---- */
self.addEventListener('push', (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { body: event.data ? event.data.text() : '' }; }
  event.waitUntil((async () => {
    await self.registration.showNotification(d.title || 'XMARKET', {
      body: d.body || '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: d.tag,
      data: { url: d.url || '/' },
    });
    const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    cs.forEach((c) => c.postMessage({ type: 'xm-push', payload: d }));
  })());
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) {
      if (c.url.indexOf(self.location.origin) === 0 && 'focus' in c) { c.navigate(url); return c.focus(); }
    }
    return self.clients.openWindow(url);
  }));
});

/* logout: wipe every cache */
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'xm-clear') e.waitUntil(caches.keys().then((ks) => Promise.all(ks.map((k) => caches.delete(k)))));
});
