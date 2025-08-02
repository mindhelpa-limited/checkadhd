// src/app/api/stripe-webhook/route.js

import { NextResponse } from "next/server";
import { db, admin } from "@/lib/firebase-admin"; // ✅ Ensure firebase-admin exports admin & db
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const sig = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const email = session.customer_details?.email;
        const customerId = session.customer;

        if (!email) {
          console.error("❌ No email in checkout session");
          break;
        }

        // ✅ Save pending user record for signup page to pick up later
        await db.collection("pending_users").doc(email).set({
          email,
          stripeCustomerId: customerId || null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          status: "paid",
        });

        console.log(`✅ Pending user record created for ${email}`);
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // 🔹 Find any users in Firestore with this stripeCustomerId
        const userQuery = await db
          .collection("users")
          .where("stripeCustomerId", "==", customerId)
          .get();

        if (!userQuery.empty) {
          for (const docSnap of userQuery.docs) {
            const status = subscription.status === "active" ? "premium" : "free";

            await docSnap.ref.update({
              tier: status,
              subscriptionStatus: subscription.status,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log(`✅ Updated tier for user ${docSnap.id} → ${status}`);
          }
        }
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
