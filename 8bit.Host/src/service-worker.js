const VERSION = '[[BuildVersion]]';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    'app-transparent.icon.png',
    'app.icon.png',
    'app.js',
    'index.html',
    './', // Alias for index.html
    'main.js',
    'sanitize.js'
];

self.addEventListener('install', e => {
    console.debug('install service worker')
    e.waitUntil(
        caches.open(VERSION)
            .then(cache => {
                return Promise.all(
                    PRECACHE_URLS.map(item => {
                        return cache.add(item).catch(error => {
                            console.error(`Error caching ${item}:`, error);
                        });
                    })
                );
            })
            .then(self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    console.debug('activate service worker')
    const currentCaches = [VERSION];

    e.waitUntil(
        caches.keys().then(names => {
            return names.filter(name => !currentCaches.includes(name));

        }).then(cachesToDelete => {
            console.debug('clear caches', cachesToDelete)

            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {

    if (e.request.url.startsWith(self.location.origin)) {

        e.respondWith(
            getCacheFirst(e.request)
        );
    }
});

async function getCacheFirst(request) {
    let response = await caches.match(request);

    if (response == null) {
        const cache = await caches.open(VERSION);
        response = await fetch(request);
        await cache.put(request, response.clone());
    }

    return response;
}
