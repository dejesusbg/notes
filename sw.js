const toCache = [
    './',
    './index.html',
    './settings.html',
    './edit.html',
    './app/script.js',
    './app/notes.js',
    './app/main.js',
    './app/settings.js',
    './app/edit.js',
    './styles/styles.css',
    './icons/icon.png',
    './icons/maskable_icon_x48.png',
    './icons/maskable_icon_x72.png',
    './icons/maskable_icon_x96.png',
    './icons/maskable_icon_x128.png',
    './icons/maskable_icon_x192.png',
    './icons/maskable_icon_x384.png',
    './icons/maskable_icon_x512.png',
    './icons/shortcut_icon.png',
    './md3/styles/components.css',
    './md3/styles/styles.css',
    './md3/script/material-you.js',
    './md3/script/monet.js'
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches
            .open("index.html")
            .then(cache => cache.addAll(toCache))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => { })
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(async res => {
                const cache = await caches.open("index.html");
                cache.put(event.request.url, res.clone());
                return res;
            })
            .catch(err => caches.match(event.request))
    );
});


