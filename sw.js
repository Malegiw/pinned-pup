/* Pinned Pup by YMD — service worker v4. © 2026 Yan Malegi Diardi */
const SHELL = 'pp-shell-v4';
const STATIC = 'pp-static-v4';
const FONTS = 'pp-fonts-v1';
const APP = ['./', './index.html', './app.css', './app.js', './examples.js', './manifest.webmanifest'];
const ASSETS = ['./vendor/leaflet.js', './vendor/leaflet.css', './vendor/leaflet-heat.js', './wilayah.txt', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    Promise.all([
      caches.open(SHELL).then((c) => c.addAll(APP)),
      caches.open(STATIC).then((c) => c.addAll(ASSETS)),
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  const keep = [SHELL, STATIC, FONTS];
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isStatic(url) {
  return url.pathname.includes('/vendor/') || url.pathname.endsWith('/wilayah.txt') || url.pathname.endsWith('.png');
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    // Libraries, icons and the kelurahan list rarely change: cache first.
    if (isStatic(url)) {
      e.respondWith(
        caches.open(STATIC).then((c) => c.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => { if (res.ok) c.put(req, res.clone()); return res; })))
      );
      return;
    }
    // App code: newest version first, saved copy when offline. Keeps HTML, CSS and JS in step.
    e.respondWith(
      fetch(req, { cache: 'no-cache' })
        .then((res) => { if (res.ok) { const copy = res.clone(); caches.open(SHELL).then((c) => c.put(req.mode === 'navigate' ? './index.html' : req, copy)); } return res; })
        .catch(() => caches.open(SHELL).then((c) => c.match(req, { ignoreSearch: true }).then((hit) => hit || (req.mode === 'navigate' ? c.match('./index.html') : undefined))))
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
  // Map tiles, place search and toilet search go straight to the network.
});
