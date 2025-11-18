import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {getFirestore,serverTimestamp} from 'firebase/firestore';





const firebaseConfig = {
  apiKey: "AIzaSyAIfFTlCdVKMApwlNvnZrN45uhtzx1BJ0I",
  authDomain: "logfirebase-project.firebaseapp.com",
  projectId: "logfirebase-project",
  storageBucket: "logfirebase-project.appspot.com",
  messagingSenderId: "58994607955",
  appId: "1:58994607955:web:f260b7c21073a18e8403a6",
  measurementId: "G-6MF6MPCB0M"
};

// Evita duplicar a inicialização
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export { serverTimestamp };
export default app;