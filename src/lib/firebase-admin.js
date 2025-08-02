// src/lib/firebase-admin.js
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = require("../../serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = getFirestore();
const auth = admin.auth();

export { admin, db, auth }; // ✅ Now also exporting admin
