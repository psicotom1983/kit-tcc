/* Kit ClÃ­nico TCC â€” service worker: permite abrir o app sem internet.
   SÃ³ guarda os arquivos do APP (cÃ³digo e base de conhecimento) â€” nunca dados de pacientes. */
const CACHE = "kit-tcc-v2.2";
const SHELL = ["./", "index.html", "kb.js", "store.js", "ia.js", "app.js", "agenda.js", "manifest.webmanifest", "icon.svg", "icon-maskable.svg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
/* tocar no aviso abre (ou traz para frente) o kit */
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(cs => { for (const c of cs) if ("focus" in c) return c.focus(); return self.clients.openWindow("./"); }));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (u.origin === location.origin) {
    /* rede primeiro (pega atualizaÃ§Ãµes), cache se estiver offline */
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
  } else if (u.hostname === "cdn.jsdelivr.net") {
    /* SDK da IA: cache depois do primeiro uso */
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return res; })));
  }
});
