// src/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// ---- Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6xUJrE2apvIxxg-Psu4VUJW0IKHRakdQ",
  authDomain: "adhdcheckwebapp.firebaseapp.com",
  projectId: "adhdcheckwebapp",
  storageBucket: "adhdcheckwebapp.appspot.com", // ✅ appspot.com
  messagingSenderId: "1053414199776",
  appId: "1:1053414199776:web:08e2c601c4d82776095b85",
  measurementId: "G-1MJC1YF7M8", // optional (only used if you add analytics)
};

// ---- Initialize once (prevents duplicate-app errors in Next.js)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// ---- Export singletons
export const auth = getAuth(app);
export const db = getFirestore(app);

// ---- Helper: save/merge basic user data
export const saveUserData = async (arg) => {
  // arg can be a userCredential (from signIn/up) or a user object
  const user = arg?.user ?? arg ?? null;

  if (!user) {
    console.error("No user authenticated.");
    return { success: false, error: "No user authenticated" };
  }

  const userDocRef = doc(db, "users", user.uid);
  const userDataToSave = {
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    providerId: user.providerId ?? null,
    lastSeen: serverTimestamp(),          // updated on every call
    // creationDate is set on first write only (merge:true won’t overwrite an existing value)
    creationDate: serverTimestamp(),
  };

  try {
    await setDoc(userDocRef, userDataToSave, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error saving user data:", error);
    return { success: false, error: error.message };
  }
};
