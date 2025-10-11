/* eslint-disable no-undef */

// ===========================================================
//  🔔 FIREBASE CLOUD MESSAGING SERVICE WORKER
//  Handles background notifications when the web app is closed.
// ===========================================================

// Import the Firebase scripts for service workers
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// -----------------------------------------------------------
//  1️⃣ Initialize Firebase (your real config values below)
// -----------------------------------------------------------
firebase.initializeApp({
  apiKey: "AIzaSyA6xUJrE2apvIxxg-Psu4VUJW0IKHRakdQ",
  authDomain: "adhdcheckwebapp.firebaseapp.com",
  projectId: "adhdcheckwebapp",
  storageBucket: "adhdcheckwebapp.firebasestorage.appspot.com",
  messagingSenderId: "1053414199776",
  appId: "1:1053414199776:web:08e2c601c4d82776095b85",
  measurementId: "G-1MJC1YF7M8",
});

// -----------------------------------------------------------
//  2️⃣ Retrieve Firebase Messaging instance
// -----------------------------------------------------------
const messaging = firebase.messaging();

// -----------------------------------------------------------
//  3️⃣ Background notification handler
// -----------------------------------------------------------
// Triggered when a push message arrives and the app is in the background
messaging.onBackgroundMessage((payload) => {
  console.log("📨 Background message received:", payload);

  const notificationTitle = payload.notification?.title || "Reminder";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new update.",
    icon: payload.notification?.icon || "/icon-192x192.png",
    badge: "/icon-192x192.png",
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// -----------------------------------------------------------
//  4️⃣ Optional: Handle click on the notification
// -----------------------------------------------------------
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  // Open your dashboard or relevant page when notification is clicked
  event.waitUntil(
    clients.openWindow("https://adhdcheck.net/dashboard")
  );
});
