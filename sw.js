// Ao publicar uma nova versão, aumente o número abaixo.
const VERSAO = 'soma-mercado-v3';
const ARQUIVOS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Abre sempre do cache (instantâneo e offline); fontes ficam guardadas na primeira abertura.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(hit => hit || fetch(e.request).then(res => {
    const u = new URL(e.request.url);
    if (res.ok && (u.origin === location.origin || u.host.endsWith('googleapis.com') || u.host.endsWith('gstatic.com'))) {
      const copia = res.clone(); caches.open(VERSAO).then(c => c.put(e.request, copia));
    }
    return res;
  }).catch(() => caches.match('./index.html'))));
});
