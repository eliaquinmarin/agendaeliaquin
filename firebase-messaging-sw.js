// Importa las librerías V8 (Compat)
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Inicializa Firebase con tu configuración
firebase.initializeApp({
  apiKey: "AIzaSyDdF_65mATjkH71yLFW97fvwQX5Sexf9Tw",
  authDomain: "notificacionesagenda.firebaseapp.com",
  projectId: "notificacionesagenda",
  storageBucket: "notificacionesagenda.firebasestorage.app",
  messagingSenderId: "168849532431",
  appId: "1:168849532431:web:f9552e888ece647672e57a"
});

const messaging = firebase.messaging();

// Esto maneja la notificación cuando el usuario tiene la web cerrada
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});