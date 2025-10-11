// src/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging"; // ✅ added

// ---- Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6xUJrE2apvIxxg-Psu4VUJW0IKHRakdQ",
  authDomain: "adhdcheckwebapp.firebaseapp.com",
  projectId: "adhdcheckwebapp",
  storageBucket: "adhdcheckwebapp.appspot.com",
  messagingSenderId: "1053414199776",
  appId: "1:1053414199776:web:08e2c601c4d82776095b85",
  measurementId: "G-1MJC1YF7M8", // optional (only used if you add analytics)
};

// ---- Initialize once (prevents duplicate-app errors in Next.js)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// ---- Export core services
export const auth = getAuth(app);
export const db = getFirestore(app);

// ---- Messaging (Client-side only)
export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;

// ---- Helper: Request permission & get FCM token
export async function requestFCMToken(vapidKey) {
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("🚫 Notification permission not granted");
      return null;
    }

    const currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      console.log("✅ FCM Token retrieved:", currentToken);
      return currentToken;
    } else {
      console.warn("⚠️ No registration token available");
      return null;
    }
  } catch (err) {
    console.error("❌ Error getting FCM token:", err);
    return null;
  }
}

// ---- Listen for foreground messages
export function onForegroundMessage(callback) {
  if (messaging) {
    onMessage(messaging, (payload) => {
      console.log("📨 Foreground message received:", payload);
      callback?.(payload);
    });
  }
}

// ---- Helper: save/merge basic user data
export const saveUserData = async (arg) => {
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
    lastSeen: serverTimestamp(),
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
