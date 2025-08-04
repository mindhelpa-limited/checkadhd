import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request) {
  try {
    // ✅ Debugging logs
    console.log(
      "🔍 STRIPE_SECRET_KEY:",
      process.env.STRIPE_SECRET_KEY ? "Loaded" : "Missing"
    );
    console.log(
      "🔍 STRIPE_PRICE_ID:",
      process.env.STRIPE_PRICE_ID ? "Loaded" : "Missing"
    );

    // ✅ Check if required environment variables are missing
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
      throw new Error("Stripe environment variables are missing.");
    }

    // ✅ Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // ✅ Get request body and origin
    const { couponCode } = await request.json();
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      request.headers.get("origin") ||
      "http://localhost:3000";

    // ✅ Create session options
    const sessionOptions = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/signup?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    };

    // ✅ Apply coupon if matched
    if (couponCode === "DRKELVIN100") {
      sessionOptions.discounts = [
        {
          coupon: "sQc5dFTN", // Replace with your actual coupon ID
        },
      ];
    }

    // ✅ Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionOptions);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("❌ Error creating Stripe session:", err.message);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
