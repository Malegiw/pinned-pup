/* Pinned Pup by YMD — service worker. © 2026 Yan Malegi Diardi */
const SHELL = 'pp-shell-v2';
const FONTS = 'pp-fonts-v1';
const FILES = ['./', './index.html', './manifest.webmanifest', './wilayah.txt', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== FONTS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // The page itself: always try the newest version first, fall back to the saved copy offline.
  if (url.origin === self.location.origin && (req.mode === 'navigate' || url.pathname.endsWith('/index.html'))) {
    e.respondWith(
      fetch(req, { cache: 'no-cache' })
        .then((res) => { if (res.ok) caches.open(SHELL).then((c) => c.put('./index.html', res.clone())); return res; })
        .catch(() => caches.open(SHELL).then((c) => c.match('./index.html')))
    );
    return;
  }

  // Other app files: serve from cache instantly, refresh in the background.
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.open(SHELL).then((cache) =>
        cache.match(req, { ignoreSearch: true }).then((hit) => {
          const net = fetch(req)
            .then((res) => { if (res.ok) cache.put(req, res.clone()); return res; })
            .catch(() => hit || (req.mode === 'navigate' ? cache.match('./index.html') : undefined));
          return hit || net;
        })
      )
    );
    return;
  }

  // Google Fonts: cache once, reuse offline.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(FONTS).then((cache) =>
        cache.match(req).then((hit) => hit || fetch(req).then((res) => { cache.put(req, res.clone()); return res; }))
      )
    );
  }
  // Map tiles and place search go straight to the network.
});
