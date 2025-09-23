import { NextResponse } from "next/server";
import Stripe from "stripe";
import { admin, db } from "@/lib/firebase-admin";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// ✅ Stripe Init
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ message: "Skipping during build" }, { status: 200 });
  }

  try {
    const body = await req.json();
    const event = body;

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const email = session.customer_details?.email;
      const uid = session.metadata?.firebase_uid;
      const coachId = session.metadata?.coachId;
      const coachName = session.metadata?.coachName;
      const category = session.metadata?.category;
      const planKey = session.metadata?.planKey;
      const planName = session.metadata?.planName;
      const sessions = session.metadata?.sessions;
      const slots = JSON.parse(session.metadata?.slots || "[]");

      let userRef;

      if (uid) {
        userRef = doc(db, "users", uid);
      } else if (email) {
        const q = query(collection(db, "users"), where("email", "==", email));
        const snap = await getDocs(q);
        if (snap.empty) {
          const newUserRef = doc(collection(db, "users"));
          await setDoc(newUserRef, {
            email,
            createdAt: new Date(),
            role: "client",
          });
          userRef = newUserRef;
        } else {
          userRef = snap.docs[0].ref;
        }
      }

      if (userRef) {
        const bookingRef = doc(collection(userRef, "bookings"));
        await setDoc(bookingRef, {
          stripeSessionId: session.id,
          email,
          coachId,
          coachName,
          category,
          planKey,
          planName,
          sessions: Number(sessions),
          slots,
          price: session.amount_total / 100,
          currency: session.currency?.toUpperCase() || "GBP",
          status: session.payment_status || "completed",
          createdAt: new Date(),
        });

        // Also save to coach’s own booking list
        const coachBookingRef = doc(db, "coaches", coachId, "bookings", bookingRef.id);
        await setDoc(coachBookingRef, {
          userId: userRef.id,
          email,
          planName,
          slots,
          createdAt: new Date(),
        });

        console.log("✅ Booking stored for:", email || uid);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
