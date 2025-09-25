import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../config/firebase';

// Initialize Firebase - evita duplicate app error
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication 
// El warning es informativo, AsyncStorage ya está instalado y Firebase lo detectará automáticamente
export const auth = getAuth(app);

// For development - uncomment these lines if you want to use Firebase emulators
// if (__DEV__) {
//   connectFirestoreEmulator(db, 'localhost', 8080);
//   connectAuthEmulator(auth, 'http://localhost:9099');
// }

export default app;