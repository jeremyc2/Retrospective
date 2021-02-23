const path = (new URL(self.registration.scope)).pathname;

var cacheName = "Retro-V1.0";
const cachefiles = [
    path,
    path + "css/main.css",
    path + "css/recents.css",
    path + "css/tooltip.css",
    path + "css/card.css",
    path + "css/details.css",
    path + "css/scrollbars.css",
    path + "css/slider.css",
    path + "css/virtualScrollbars.css",
    path + "javascript/mobile-full-height.js",
    path + "javascript/animate.js",
    path + "javascript/data.js",
    path + "javascript/main.js",
    path + "javascript/details.js",
    path + "javascript/fs-helpers.js",
    path + "javascript/fs-menu.js",
    path + "javascript/idb-keyval.js",
    path + "javascript/recents.js",
    path + "javascript/virtualScrollbars.js",
    path + "img/fullscreen.svg",
    path + "img/copy.svg",
    path + "img/divider.svg",
    path + "img/logo.svg",
    path + "manifest.webmanifest",
    path + "img/icons/192.png"
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