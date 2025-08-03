// src/app/api/stripe-webhook/route.js
import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase-admin";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const sig = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      console.log("✅ Webhook Event Received:", event.type);
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return NextResponse.json({ error: "Webhook error" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("✅ Checkout Session Data:", session);

      const userEmail = session.customer_details?.email;
      const stripeCustomerId = session.customer;

      if (!userEmail) {
        console.error("❌ No email found in session");
        return NextResponse.json({ error: "No email in session" }, { status: 400 });
      }

      console.log(`🔄 Writing pending user for: ${userEmail}`);

      const pendingUserRef = db.collection("pending_users").doc(userEmail);
      await pendingUserRef.set({
        email: userEmail,
        stripeCustomerId,
        createdAt: new Date(),
        status: "paid",
      });

      console.log(`✅ Pending user record created for: ${userEmail}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("🔥 Error in Stripe webhook:", err.message);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false, // 🚨 REQUIRED for raw body in Stripe webhook
  },
};
