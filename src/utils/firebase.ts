import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { FIREBASE_API_KEY, IS_DEV } from './contants';
import type { FirebaseOptions } from 'firebase/app';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: FIREBASE_API_KEY,
  authDomain: 'eczane-tracker.firebaseapp.com',
  projectId: 'eczane-tracker',
  storageBucket: 'eczane-tracker.appspot.com',
  messagingSenderId: '662266221623',
  appId: '1:662266221623:web:b8b0c7442b9b1a4cf2dbb2',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const functions = getFunctions(app, 'europe-west1');

export const API_URL = IS_DEV ? 'http://127.0.0.1:5001/eczane-tracker/europe-west1' : 'https://europe-west1-eczane-tracker.cloudfunctions.net';

if (IS_DEV) {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
