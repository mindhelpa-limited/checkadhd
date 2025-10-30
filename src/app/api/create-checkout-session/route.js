import { NextResponse } from "next/server";
import Stripe from "stripe";
import { admin, db } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// ---- Product lookup map ----
const PRODUCT_LOOKUPS = {
  premium: { key: "premium_onetime_gbp", mode: "payment", tag: "premium" },
  adhd_assessment: { key: "adhd_clinical_assessment", mode: "payment", tag: "adhd_assessment" },
  recovery_monthly: { key: "recovery_monthly", mode: "subscription", tag: "recovery" },
  recovery_yearly: { key: "recovery_yearly", mode: "subscription", tag: "recovery" },
  institute: { key: "institute_onetime", mode: "payment", tag: "institute" },

  // ---- Coaching: Small Groups (1–5) ----
  coaching_smallgroup_monthly: { key: "coaching_smallgroup_monthly", mode: "subscription", tag: "coaching" },
  coaching_smallgroup_quarterly: { key: "coaching_smallgroup_quarterly", mode: "subscription", tag: "coaching" },
  coaching_smallgroup_6month: { key: "coaching_smallgroup_6month", mode: "subscription", tag: "coaching" },
  coaching_smallgroup_yearly: { key: "coaching_smallgroup_yearly", mode: "subscription", tag: "coaching" },

  // ---- Coaching: Individual ----
  coaching_individual_monthly: { key: "coaching_individual_monthly", mode: "subscription", tag: "coaching" },
  coaching_individual_quarterly: { key: "coaching_individual_quarterly", mode: "subscription", tag: "coaching" },
  coaching_individual_6month: { key: "coaching_individual_6month", mode: "subscription", tag: "coaching" },
  coaching_individual_yearly: { key: "coaching_individual_yearly", mode: "subscription", tag: "coaching" },

  // ---- Coaching: Large Groups (5–10) ----
  coaching_largegroup_monthly: { key: "coaching_largegroup_monthly", mode: "subscription", tag: "coaching" },
  coaching_largegroup_quarterly: { key: "coaching_largegroup_quarterly", mode: "subscription", tag: "coaching" },
  coaching_largegroup_6month: { key: "coaching_largegroup_6month", mode: "subscription", tag: "coaching" },
  coaching_largegroup_yearly: { key: "coaching_largegroup_yearly", mode: "subscription", tag: "coaching" },
};

export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch {}

    const {
      email = "",
      successRedirect = "/signup",
      product = "premium",
      couponCode = "",
    } = body;

    const productConfig = PRODUCT_LOOKUPS[product];
    if (!productConfig) throw new Error(`Invalid product: ${product}`);

    // ---- Fetch Stripe price ----
    const prices = await stripe.prices.list({
      lookup_keys: [productConfig.key],
      active: true,
      limit: 1,
    });
    if (!prices.data.length)
      throw new Error(`Stripe price not found: ${productConfig.key}`);
    const priceId = prices.data[0].id;

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      request.headers.get("origin") ||
      "http://localhost:3000";

    // ---- Firebase Auth ----
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

          await userRef.set(
            {
              stripeCustomerId: customerId,
              activeSubscription: product,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
        } else {
          await userRef.set(
            {
              activeSubscription: product,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
        }
      } catch {
        uid = null;
        customerId = null;
      }
    }

    // ---- Session Options ----
    const sessionOptions = {
      mode: productConfig.mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}${successRedirect}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      client_reference_id: uid || `guest-${crypto.randomUUID()}`,
      metadata: { firebase_uid: uid || "", product, tag: productConfig.tag },
    };

    // ✅ Apply coupon dynamically
    if (couponCode.trim()) {
      const promo = await stripe.promotionCodes.list({
        code: couponCode.trim(),
        active: true,
        limit: 1,
      });
      if (promo.data.length > 0) {
        sessionOptions.discounts = [{ promotion_code: promo.data[0].id }];
      }
    }

    if (customerId) sessionOptions.customer = customerId;
    else if (email) sessionOptions.customer_email = email;

    // ✅ Add 7-day free trial for subscriptions only
    if (productConfig.mode === "subscription") {
      sessionOptions.subscription_data = { trial_period_days: 7 };
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
