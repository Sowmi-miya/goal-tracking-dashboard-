// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9UxEATtU69exZN4nZZtaybnxb0Y7iiXg",
  authDomain: "boss-domain.firebaseapp.com",
  projectId: "boss-domain",
  storageBucket: "boss-domain.appspot.com",
  messagingSenderId: "57804801857",
  appId: "1:57804801857:web:5ba2213193e27e0b3743c0",
  measurementId: "G-XFF4EMSEVP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and db to use elsewhere
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
