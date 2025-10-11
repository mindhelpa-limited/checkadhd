import { NextResponse } from "next/server";
import Stripe from "stripe";
import { admin, db } from "@/lib/firebase-admin"; // ✅ use admin SDK

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  try {
    let email = "";
    try {
      const body = await req.json();
      email = body?.email || "";
    } catch {}

    const authHeader = req.headers.get("authorization") || "";
    let customerId = null;

    // 1️⃣ Try to get Stripe ID using Firebase Auth (logged-in user)
    if (authHeader.startsWith("Bearer ")) {
      const idToken = authHeader.slice(7);
      const decoded = await admin.auth().verifyIdToken(idToken);
      const uid = decoded.uid;

      const userSnap = await db.collection("users").doc(uid).get();
      if (userSnap.exists) {
        customerId = userSnap.data().stripeCustomerId;
      }
    }

    // 2️⃣ Fallback: Lookup by email for guest checkouts
    if (!customerId && email) {
      const snap = await db
        .collection("users")
        .where("email", "==", email)
        .get();

      if (!snap.empty) {
        customerId = snap.docs[0].data().stripeCustomerId;
      }
    }

    // 3️⃣ Handle missing ID
    if (!customerId) {
      return NextResponse.json(
        { error: "Stripe customer ID not found for this user." },
        { status: 404 }
      );
    }

    // 4️⃣ Create Stripe Billing Portal
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("❌ create-portal-session error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
