import { NextResponse } from "next/server";
import Stripe from "stripe";
import { admin, db } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!idToken) return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    const { uid } = await admin.auth().verifyIdToken(idToken);

    const userRef = db.collection("users").doc(uid);
    const snap = await userRef.get();
    let customerId = snap.exists ? snap.data()?.stripeCustomerId : null;

    if (!customerId) {
      const fbUser = await admin.auth().getUser(uid);
      const customer = await stripe.customers.create({
        email: fbUser.email || undefined,
        metadata: { firebase_uid: uid },
      });
      customerId = customer.id;
      await userRef.set({ stripeCustomerId: customerId }, { merge: true });
    }

    const { couponCode = "", billingCycle = "monthly" } = await request.json();

    const lookupKey = billingCycle === "yearly" ? "premium_yearly_gbp" : "premium_monthly_gbp";

    const prices = await stripe.prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
    if (!prices.data.length) throw new Error(`Stripe price not found: ${lookupKey}`);
    const priceId = prices.data[0].id;

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      request.headers.get("origin") ||
      "http://localhost:3000";

    const sessionOptions = {
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/signup?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: { firebase_uid: uid },
      // allow_promotion_codes: true,
      // automatic_tax: { enabled: true },
    };

    if (couponCode === "DRKELVIN100") {
      sessionOptions.discounts = [{ coupon: "sQc5dFTN" }];
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("❌ create-checkout-session error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
