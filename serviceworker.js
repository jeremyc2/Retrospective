const path = (new URL(self.registration.scope)).pathname;

var cacheName = "Retro-V2.0";
const cachefiles = [
    path,
    path + "css/animate.css",
    path + "css/card.css",
    path + "css/details.css",
    path + "css/main.css",
    path + "css/permanentMarker.css",
    path + "css/recents.css",
    path + "css/scrollbars.css",
    path + "css/slider.css",
    path + "css/tooltip.css",
    path + "fonts/permanentMarker.woff2",
    path + "img/copy.svg",
    path + "img/divider.svg",
    path + "img/fullscreen.svg",
    path + "img/icons/192.png",
    path + "img/lightning.svg",
    path + "img/logo.svg",
    path + "javascript/animate.js",
    path + "javascript/data.js",
    path + "javascript/details.js",
    path + "javascript/fs-helpers.js",
    path + "javascript/fs-menu.js",
    path + "javascript/idb-keyval.js",
    path + "javascript/main.js",
    path + "javascript/mobile-full-height.js",
    path + "javascript/recents.js",
    path + "manifest.webmanifest"
]

self.addEventListener("install", event => {
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(cachefiles);
        })
    );

});
 
self.addEventListener("activate", () => {
    clients.claim();

});

self.addEventListener("fetch", event => {
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