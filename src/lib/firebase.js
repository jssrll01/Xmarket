import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyDaOfzGFbAX0Xdb2nuAdCVdFQ4D2vJ5A44',
  authDomain: 'xmarket-pwa.firebaseapp.com',
  projectId: 'xmarket-pwa',
  storageBucket: 'xmarket-pwa.firebasestorage.app',
  messagingSenderId: '404310145138',
  appId: '1:404310145138:web:e83faecb3ed8d54f84aaeb',
  measurementId: 'G-LSF1TS8PD6',
};

export const app = initializeApp(firebaseConfig);

// VAPID key from your Firebase console
export const VAPID_KEY = 'BBirF3bHnUF-UBUbYZn6ALNnWVmsxNIwLaCo876GpX5nSUIKZSIgTVh_pJvHDiBIhe9AzqhbFwMqcN34BrXT2Ac';

let _messaging = null;
export async function getMessagingSafe() {
  if (_messaging) return _messaging;
  try {
    if (!(await isSupported())) return null;
    _messaging = getMessaging(app);
    return _messaging;
  } catch {
    return null;
  }
}
