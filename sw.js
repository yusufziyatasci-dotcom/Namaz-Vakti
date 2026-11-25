const V='namaz-v1';
const FILES=['./','index.html','manifest.webmanifest','icons/apple-touch-icon.png','icons/icon-192.png','icons/icon-512.png','icons/maskable-192.png','icons/maskable-512.png','fonts/amiri-arabic-400-normal.woff2','fonts/amiri-quran-arabic-400-normal.woff2','fonts/inter-latin-400-normal.woff2','fonts/inter-latin-500-normal.woff2','fonts/inter-latin-600-normal.woff2','fonts/inter-latin-ext-400-normal.woff2','fonts/inter-latin-ext-500-normal.woff2','fonts/inter-latin-ext-600-normal.woff2','fonts/marcellus-latin-400-normal.woff2','fonts/marcellus-latin-ext-400-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);if(url.origin!==location.origin)return;
  // sayfa: önce ağ (güncel sürüm), olmazsa önbellek; diğer dosyalar: önce önbellek
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(V).then(c=>c.put('index.html',cp));return r}).catch(()=>caches.match('index.html')));
    return}
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
