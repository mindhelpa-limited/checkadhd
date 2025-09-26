// /app/api/create-checkout-session/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { admin, db } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(request) {
  try {
    // ---- Body (works for both auth + guest) ----
    let body = {};
    try {
      body = await request.json();
    } catch {
      // no body is fine
    }
    const {
      couponCode = "",
      email = "", // optional prefill for guests
      successRedirect = "/signup", // 👈 default fallback
    } = body;

    // ---- Price lookup (one-time) ----
    const lookupKey = "premium_onetime_gbp"; // 👈 your new Stripe lookup key
    const prices = await stripe.prices.list({
      lookup_keys: [lookupKey],
      active: true,
      limit: 1,
    });
    if (!prices.data.length)
      throw new Error(`Stripe price not found: ${lookupKey}`);
    const priceId = prices.data[0].id;

    // ---- Success/Cancel URLs ----
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      request.headers.get("origin") ||
      "http://localhost:3000";

    // ---- Try Firebase auth (optional) ----
    let uid = null;
    let customerId = null;

    const authHeader = request.headers.get("authorization") || "";
    const idToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (idToken) {
      try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        uid = decoded.uid;

        // Ensure/use saved Stripe customer for this UID
        const userRef = db.collection("users").doc(uid);
        const snap = await userRef.get();
        customerId = snap.exists ? snap.data()?.stripeCustomerId : null;

        if (!customerId) {
          const fbUser = await admin.auth().getUser(uid);
          const customer = await stripe.customers.create({
            email: fbUser.email || undefined,
            metadata: { firebase_uid: uid },
          });
          customerId = customer.id;
          await userRef.set({ stripeCustomerId: customerId }, { merge: true });
        }
      } catch {
        // Invalid/missing token -> proceed as guest
        uid = null;
        customerId = null;
      }
    }

    // ---- Build session options (ONE-TIME PAYMENT) ----
    const sessionOptions = {
      mode: "payment", // 👈 one-time, not subscription
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}${successRedirect}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      client_reference_id: uid || `guest-${crypto.randomUUID()}`,
      metadata: { firebase_uid: uid || "", product: "premium" },
    };

    // If authenticated, attach the existing Stripe customer
    if (customerId) {
      sessionOptions.customer = customerId;
    } else {
      if (email) sessionOptions.customer_email = email; // optional prefill
    }

    // Optional hard-coded coupon
    if (couponCode === "DRKELVIN100") {
      sessionOptions.discounts = [{ coupon: "sQc5dFTN" }];
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("❌ create-checkout-session error:", err);
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}
