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

// 4. Firebase Messaging: CORREGIDO Y SINTAXIS AJUSTADA
messaging.onBackgroundMessage((payload) => {
    console.log('[sw.js] Mensaje recibido:', payload);
    
    const notificationTitle = payload.notification.title || 'Nueva Notificación';
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon.svg',      // Asegúrate de tener este archivo en la raíz
        badge: '/icon.svg',     
        vibrate: [200, 100, 200, 100, 200], // Patrón de vibración nativo
        silent: false,          // Permite sonido del sistema
        requireInteraction: true, // Mantiene la notificación visible
        data: {
            url: payload.fcmOptions?.link || '/' // URL de redirección
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
