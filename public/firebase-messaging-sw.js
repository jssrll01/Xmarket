importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDaOfzGFbAX0Xdb2nuAdCVdFQ4D2vJ5A44',
  authDomain: 'xmarket-pwa.firebaseapp.com',
  projectId: 'xmarket-pwa',
  storageBucket: 'xmarket-pwa.firebasestorage.app',
  messagingSenderId: '404310145138',
  appId: '1:404310145138:web:e83faecb3ed8d54f84aaeb',
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'XMARKET';
  const body  = payload.notification?.body  || '';
  const icon  = '/icons/icon-192.png';
  const link  = payload.data?.url || '/';

  self.registration.showNotification(title, {
    body,
    icon,
    badge: icon,
    data: { url: link },
  });
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.includes(self.location.origin) && 'focus' in c) {
          c.navigate(url);
          return c.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
