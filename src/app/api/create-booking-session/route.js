import { NextResponse } from "next/server";
import Stripe from "stripe";
import { admin, db } from "@/lib/firebase-admin";

export const runtime = "nodejs";

// Init Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      coachId,
      coachName,
      category,
      plan,   // { key, name, sessions, price }
      slots,  // [{ day, time, id }]
      email = "",
      // We will no longer need the couponCode variable as we're enabling promotions in Stripe
    } = body;

    if (!plan?.price) {
      throw new Error("Plan details missing");
    }

    // ---- Success/Cancel URLs ----
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      request.headers.get("origin") ||
      "http://localhost:3000";

    // ---- Try Firebase Auth (optional) ----
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

        // Look up existing stripeCustomerId
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
        uid = null;
        customerId = null;
      }
    }

    // ---- Build checkout session (ONE-TIME payment) ----
    const sessionOptions = {
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `${coachName} — ${plan.name} (${category})`,
              description: `Includes ${plan.sessions} session(s).`,
            },
            unit_amount: plan.price * 100, // convert £ to pence
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/coach/my-sessions`,
      cancel_url: `${origin}/book-a-coach?canceled=true`,
      client_reference_id: uid || `guest-${crypto.randomUUID()}`,
      // This new line allows customers to apply promotion codes on the Stripe checkout page
      allow_promotion_codes: true,
      metadata: {
        productType: "booking", // 👈 important for webhook
        firebase_uid: uid || "",
        coachId,
        coachName,
        category,
        planKey: plan.key,
        planName: plan.name,
        sessions: plan.sessions,
        slots: JSON.stringify(slots),
      },
    };

    // ---- Attach customer or email ----
    if (customerId) {
      sessionOptions.customer = customerId;
    } else if (email) {
      sessionOptions.customer_email = email;
    }

    // ---- Apply coupon (hardcoded for testing) ----
    // This logic is no longer needed since we are enabling `allow_promotion_codes`
    // on the checkout session options. Customers can now enter codes themselves.
    // if (couponCode === "DRKELVIN100") {
    //   sessionOptions.discounts = [{ coupon: "sQc5dFTN" }]; // replace with your Stripe coupon ID
    // }

    // ---- Create Stripe checkout session ----
    const session = await stripe.checkout.sessions.create(sessionOptions);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("❌ create-booking-session error:", err);
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}
