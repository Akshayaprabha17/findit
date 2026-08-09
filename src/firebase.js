import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBVIXP-t4VvHhmi42ShIPEI9S1SD_OWh9Y",
  authDomain: "findit-orlost.firebaseapp.com",
  projectId: "findit-orlost",
  storageBucket: "findit-orlost.firebasestorage.app",
  messagingSenderId: "1040495879041",
  appId: "1:1040495879041:web:52b146c90e0b1c0d9d3e80"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);