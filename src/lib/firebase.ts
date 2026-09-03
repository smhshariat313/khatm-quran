import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let appInstance: any = null;
let dbInstance: Firestore | null = null;

export function getFirebaseApp() {
  if (!appInstance) {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return appInstance;
}

export function getFirestoreDb(): Firestore {
  if (!dbInstance) {
    const app = getFirebaseApp();
    if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') {
      dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    } else {
      dbInstance = getFirestore(app);
    }
  }
  return dbInstance;
}
