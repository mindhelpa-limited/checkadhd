import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export async function POST(req) {
  // 🛑 Skip execution during build
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

      if (email) {
        try {
          // 🔥 Find Firestore user by email and upgrade tier
          const q = query(collection(db, "users"), where("email", "==", email));
          const usersSnapshot = await getDocs(q);

          if (!usersSnapshot.empty) {
            const userDoc = usersSnapshot.docs[0];
            await updateDoc(userDoc.ref, { tier: "premium" });
            console.log(`✅ Upgraded user (${email}) to premium`);
          }
        } catch (error) {
          console.error("❌ Failed to upgrade user:", error);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
