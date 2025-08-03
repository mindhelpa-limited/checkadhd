import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { couponCode } = await request.json();

    const sessionOptions = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/signup?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    };

    // ✅ Safer coupon logic
    if (couponCode?.trim().toUpperCase() === "DRKELVIN100") {
      sessionOptions.discounts = [{ coupon: "sQc5dFTN" }];
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Error creating Stripe session:", err);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
