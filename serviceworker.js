const path = (new URL(self.registration.scope)).pathname;

const version = "2.8",
      cacheName = `Retro-V${version}`;

const cachefiles = [
    path,
    path + "index.html",
    path + "load.html",
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
    path + "img/east_black_24dp.svg",
    path + "img/exit-fullscreen.svg",
    path + "img/fullscreen.svg",
    path + "img/help_outline_black_24dp.svg",
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

const broadcast = new BroadcastChannel('retro-channel');
broadcast.onmessage = (event) => {
    if(event.data.type == 'REQUEST-VERSION') {
        broadcast.postMessage({type: 'APP-VERSION', payload: version});
    }
}

self.addEventListener("install", event => {
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(cachefiles);
        })
    );

});
 
self.addEventListener("activate", event => {
    clients.claim();
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(name) {
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin
                    return name != cacheName;
                }).map(function(name) {
                    return caches.delete(name);
                })
            );
        })
    );

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