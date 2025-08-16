import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request) {
  try {
    // Basic sanity check
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });

    const { couponCode = "", billingCycle = "monthly" } = await request.json();

    // Map toggle -> your Stripe lookup keys
    const lookupKey =
      billingCycle === "yearly" ? "premium_yearly_gbp" : "premium_monthly_gbp";

    // Resolve lookup key to actual Price ID
    const prices = await stripe.prices.list({
      lookup_keys: [lookupKey],
      active: true,
      limit: 1,
    });
    if (!prices.data.length) {
      throw new Error(`Stripe price not found for lookup key: ${lookupKey}`);
    }
    const priceId = prices.data[0].id;

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      request.headers.get("origin") ||
      "http://localhost:3000";

    const sessionOptions = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/signup?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      // Optional:
      // automatic_tax: { enabled: true }, // if you use Stripe Tax
      // billing_address_collection: "auto",
      // allow_promotion_codes: true, // use this if you prefer promo codes instead of hard-coded coupon IDs
    };

    // Keep your existing coupon logic (or switch to allow_promotion_codes above)
    if (couponCode === "DRKELVIN100") {
      sessionOptions.discounts = [{ coupon: "sQc5dFTN" }]; // your coupon ID
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("❌ Error creating Stripe session:", err.message);
    return NextResponse.json(
      { error: err.message || "Error creating checkout session" },
      { status: 500 }
    );
  }
}
