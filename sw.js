const CACHE="quizarena-multiplayer-category-fixed-1";
const ASSETS=["./","./index.html","./index6.html?v=20260930-force2","./manifest.webmanifest?v=20260930-force2","./icon-192.png","./icon-512.png"];
self.addEventListener("install",event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));
});
self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith("quizarena-")&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  event.respondWith((async()=>{
    try{
      const fresh=await fetch(event.request,{cache:"no-store"});
      const copy=fresh.clone();
      caches.open(CACHE).then(c=>c.put(event.request,copy)).catch(()=>{});
      return fresh;
    }catch(e){
      return (await caches.match(event.request)) || (await caches.match("./index6.html?v=20260930-force2"));
    }
  })());
});