// sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDdF_65mATjkH71yLFW97fvwQX5Sexf9Tw",
  projectId: "notificacionesagenda",
  messagingSenderId: "168849532431",
  appId: "1:168849532431:web:f9552e888ece647672e57a"
});

const messaging = firebase.messaging();

// Manejador en segundo plano
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
