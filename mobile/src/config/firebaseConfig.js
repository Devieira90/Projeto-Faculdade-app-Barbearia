import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAIfFTlCdVKMApwlNvnZrN45uhtzx1BJ0I",
  authDomain: "logfirebase-project.firebaseapp.com",
  projectId: "logfirebase-project",
  storageBucket: "logfirebase-project.appspot.com",
  messagingSenderId: "58994607955",
  appId: "1:58994607955:web:f260b7c21073a18e8403a6",
  measurementId: "G-6MF6MPCB0M"
};

// Inicialização robusta para evitar reinicialização
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);
export { serverTimestamp, auth };
export default app;