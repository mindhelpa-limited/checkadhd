// src/app/api/manage-subscription/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { admin, db } from "@/lib/firebase-admin";

export const runtime = "nodejs"; // Stripe + firebase-admin require Node runtime

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// Simple ping so you can test /api/manage-subscription in the browser
export async function GET() {
  return NextResponse.json({ ok: true, route: "manage-subscription" });
}

export async function POST(req) {
  try {
    // 1) Verify Firebase ID token from Authorization header
    const authHeader = req.headers.get("authorization") || "";
    const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!idToken) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }
    const { uid } = await admin.auth().verifyIdToken(idToken);

    // 2) Look up the user's Stripe customer ID in Firestore
    const snap = await db.collection("users").doc(uid).get();
    const customerId = snap.exists ? snap.data()?.stripeCustomerId : null;
    if (!customerId) {
      return NextResponse.json(
        { error: "No Stripe customer linked. Please subscribe first." },
        { status: 400 }
      );
    }

    // 3) Build the return URL (configurable)
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";

    // Allow override via env; default to /dashboard/profile
    const returnPath = process.env.STRIPE_PORTAL_RETURN_PATH || "/dashboard/profile";

    // 4) Create Stripe Billing Portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}${returnPath}`,
      // If you have a specific portal configuration ID, you can pass it too:
      // configuration: process.env.STRIPE_PORTAL_CONFIGURATION_ID,
    });

    // 5) Send the portal URL back to the client
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Manage subscription error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
