// sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const CACHE_NAME = 'agenda-fe-v1';

// Inicializa Firebase dentro del Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyDdF_65mATjkH71yLFW97fvwQX5Sexf9Tw",
  projectId: "notificacionesagenda",
  messagingSenderId: "168849532431",
  appId: "1:168849532431:web:f9552e888ece647672e57a"
});

const messaging = firebase.messaging();

// 1. Instalación: Fuerza la activación y guarda archivos en caché
self.addEventListener('install', (event) => {
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(['/', '/index.html']);
        })
    );
});

// 2. Activación: Toma el control y LIMPIA cachés antiguas
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) return caches.delete(cache);
                })
            );
        }).then(() => clients.claim())
    );
});

// 3. Estrategia de Red: Prioriza internet, luego caché
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});

// 4. Firebase Messaging (Manejo de notificaciones en background)
// Nota: onBackgroundMessage es el estándar de Firebase v9
messaging.onBackgroundMessage((payload) => {
    console.log('[sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});