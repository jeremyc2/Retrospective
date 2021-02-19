const path = (new URL(self.registration.scope)).pathname;

console.log("path", path);

var cacheName = "Retro-V1.0";
const cachefiles = [
    path,
    path + "manifest.webmanifest"
]

self.addEventListener("install", event => {
    console.log("Installing...");

    self.skipWaiting();
    
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(cachefiles);
        })
    );

});
 
self.addEventListener("activate", event => {
    console.log("Activating...");

    clients.claim();

});

self.addEventListener("fetch", event => {
    console.log(event.request.url);
    const parsedUrl = new URL(event.request.url);

    // might have to clone request and response

    if(parsedUrl.host == self.location.host) {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                return response || fetch(event.request);
            })
        );
    } else {
        return;
    }

});