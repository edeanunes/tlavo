const CACHE = 'tlavo-v1';
const ARQUIVOS = ['index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Requisições para Telegram sempre vão para a rede
  if(e.request.url.includes('telegram.org')) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
