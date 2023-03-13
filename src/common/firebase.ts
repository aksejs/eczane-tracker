import { FirebaseOptions, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { FIREBASE_API_KEY } from './contants'

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: FIREBASE_API_KEY,
  authDomain: 'eczane-tracker.firebaseapp.com',
  projectId: 'eczane-tracker',
  storageBucket: 'eczane-tracker.appspot.com',
  messagingSenderId: '662266221623',
  appId: '1:662266221623:web:b8b0c7442b9b1a4cf2dbb2',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
