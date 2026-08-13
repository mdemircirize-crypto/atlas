// Atlas — basit önbellek: uygulamayı internetsizken de açılabilir yapar.
// Sürüm numarasını her önemli güncellemede artır (v1 -> v2 ...),
// böylece kullanıcıların telefonunda eski önbellek yerine yenisi devreye girer.
const ATLAS_SURUM = 'atlas-v1';
const ONBELLEK_DOSYALARI = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(ATLAS_SURUM).then((cache) => cache.addAll(ONBELLEK_DOSYALARI))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((isimler) =>
      Promise.all(
        isimler.filter((isim) => isim !== ATLAS_SURUM).map((isim) => caches.delete(isim))
      )
    )
  );
  self.clients.claim();
});

// Önce ağdan dene (güncel veri için), olmazsa önbellekten sun.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((yanit) => {
        const kopya = yanit.clone();
        caches.open(ATLAS_SURUM).then((cache) => cache.put(event.request, kopya));
        return yanit;
      })
      .catch(() => caches.match(event.request))
  );
});
