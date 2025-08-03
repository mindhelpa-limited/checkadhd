// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6xUJrE2apvIxxg-Psu4VUJW0IKHRakdQ",
  authDomain: "adhdcheckwebapp.firebaseapp.com",
  projectId: "adhdcheckwebapp",
  storageBucket: "adhdcheckwebapp.firebasestorage.app",
  messagingSenderId: "1053414199776",
  appId: "1:1053414199776:web:08e2c601c4d82776095b85",
  measurementId: "G-1MJC1YF7M8"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Authentication
export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ Add this line


