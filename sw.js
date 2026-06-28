// sw.js
const CACHE_NAME = 'agenda-fe-v1';

// 1. Instalación: Fuerza la activación y guarda archivos en caché
self.addEventListener('install', (event) => {
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/index.html'
            ]);
        })
    );
});

// 2. Activación: Toma el control y LIMPIA cachés antiguas
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('SW: Eliminando caché antigua', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => clients.claim())
    );
});

// 3. Estrategia de Red: Prioriza internet, luego caché
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'Agenda', body: 'Nuevo programa' };
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/favicon.ico'
        })
    );
});