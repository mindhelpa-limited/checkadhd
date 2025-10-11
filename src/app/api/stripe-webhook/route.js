import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { arrayUnion, serverTimestamp } from "firebase/firestore";

// === Initialize Stripe ===
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export async function POST(req) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json(
      { message: "Skipping Stripe webhook at build time" },
      { status: 200 }
    );
  }

  try {
    const body = await req.json();
    const event = body;

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.customer_details?.email;
      const customerId = session.customer;

      // ✅ Determine which product was purchased
      let productTag = "premium";
      if (session.metadata?.product === "recovery") productTag = "recovery";
      if (session.metadata?.product === "coaching") productTag = "coaching";
      if (session.metadata?.product === "institute") productTag = "institute";
      if (session.metadata?.product === "premium") productTag = "premium";

      // ✅ Determine if subscription or one-time
      const productType =
        session.mode === "subscription" ? "subscription" : "onetime";

      // ✅ Build structured purchase data
      const purchaseData = {
        product: productTag,
        type: productType,
        date: new Date().toISOString(),
      };

      if (email) {
        // --- Save to pending_users ---
        const pendingRef = doc(db, "pending_users", email);
        await setDoc(pendingRef, {
          email,
          stripeCustomerId: customerId,
          product: productTag,
          type: productType,
          createdAt: serverTimestamp(),
        });
        console.log(`✅ Saved ${email} as pending with ${productTag}`);

        // --- Upgrade or create user ---
        const q = query(collection(db, "users"), where("email", "==", email));
        const usersSnapshot = await getDocs(q);

        if (!usersSnapshot.empty) {
          // User exists — update
          const userDoc = usersSnapshot.docs[0];
          await updateDoc(userDoc.ref, {
            stripeCustomerId: customerId,
            activeSubscription: productTag,
            tiers: arrayUnion(purchaseData), // ✅ Now adds structured object
            updatedAt: serverTimestamp(),
          });
          console.log(`✅ Updated ${email} with ${productTag} (${productType})`);
        } else {
          // User doesn't exist — create
          const newUserRef = doc(collection(db, "users"));
          await setDoc(newUserRef, {
            email,
            stripeCustomerId: customerId,
            activeSubscription: productTag,
            tiers: [purchaseData],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          console.log(`✅ Created new user for ${email} with ${productTag}`);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
