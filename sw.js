// sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const CACHE_NAME = 'agenda-fe-v1';

firebase.initializeApp({
  apiKey: "AIzaSyDdF_65mATjkH71yLFW97fvwQX5Sexf9Tw",
  projectId: "notificacionesagenda",
  messagingSenderId: "168849532431",
  appId: "1:168849532431:web:f9552e888ece647672e57a"
});

const messaging = firebase.messaging();

// 1. Instalación
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(['/', '/index.html']);
        })
    );
});

// 2. Activación
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

// 3. Estrategia de Red
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});

// 4. Firebase Messaging: CORREGIDO PARA NOTIFICACIÓN NATIVA
messaging.onBackgroundMessage((payload) => {
    console.log('[sw.js] Mensaje recibido:', payload);
    
    const notificationTitle = payload.notification.title || 'Nueva Notificación';
    const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.svg',      // Apunta al archivo físico
    badge: '/icon.svg',     // Se recomienda que el badge sea una versión simple monocromática
    vibrate: [200, 100, 200, 100, 200],
    silent: false,
    requireInteraction: true
        data: {
            url: payload.fcmOptions?.link || '/' // Abre el link si viene en el payload
        }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// 5. Opcional: Manejo del clic en la notificación
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
