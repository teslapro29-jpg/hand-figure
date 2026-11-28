/* Hand Control Magic: oflayn kesh. Yangilanganda CACHE nomini o‘zgartiring (v1 -> v2). */
const CACHE='hcm-v1',MV='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
const LOCAL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',MV+'/vision_bundle.mjs',
 MV+'/wasm/vision_wasm_internal.js',MV+'/wasm/vision_wasm_internal.wasm',MV+'/wasm/vision_wasm_nosimd_internal.js',MV+'/wasm/vision_wasm_nosimd_internal.wasm',
 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{
 const c=await caches.open(CACHE);await c.addAll(LOCAL);
 await Promise.allSettled(CDN.map(u=>c.add(u)));   // ba'zilari bo‘lmasa ham o‘rnatish to‘xtamaydi
 self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||!(u.origin===location.origin||/(^|\.)(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|storage\.googleapis\.com)$/.test(u.host)))return;
 e.respondWith(caches.match(r).then(hit=>{
  const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const k=res.clone();caches.open(CACHE).then(c=>c.put(r,k))}return res}).catch(()=>hit||Response.error());
  return hit||net;   // avval keshdan, fonda yangilaydi
 }))});
