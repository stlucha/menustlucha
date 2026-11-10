/* Service worker St. Lucha Menu.
   Menampilkan versi tersimpan lebih dulu (cepat, jalan tanpa internet), lalu memperbarui di belakang layar.
   Kalau menu diubah, perangkat mendapat versi baru di pembukaan berikutnya setelah online. */
const CACHE = "lucha-menu-v4";
const ASSETS = [
  "./",
  "fonts/figtree-latin-400-normal.woff2",
  "fonts/figtree-latin-500-normal.woff2",
  "fonts/figtree-latin-600-normal.woff2",
  "fonts/figtree-latin-700-normal.woff2",
  "fonts/rubik-latin-900-italic.woff2",
  "foto/aksen-1.jpg",
  "foto/aksen-2.jpg",
  "foto/aksen-3.jpg",
  "foto/aksen-4.jpg",
  "foto/aksen-5.jpg",
  "foto/aksen-6.jpg",
  "foto/aksen-7.jpg",
  "foto/aksen-8.jpg",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/logo.png",
  "index.html",
  "manifest.webmanifest"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const fresh = fetch(req).then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
      if (cached) { e.waitUntil(fresh); return cached; }
      const res = await fresh;
      if (res) return res;
      if (req.mode === "navigate") return cache.match("./index.html") || cache.match("./");
      return Response.error();
    })
  );
});
