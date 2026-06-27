// sw.js
const CACHE_NAME = 'agenda-fe-v1';

// Al instalar, el SW puede guardar en caché los archivos principales
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/index.html'
                // Puedes agregar aquí tus otros archivos css o js
            ]);
        })
    );
});

// El evento fetch es OBLIGATORIO para la instalación tipo App
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});