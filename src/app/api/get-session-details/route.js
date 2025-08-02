// src/app/api/get-session-details/route.js

import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // ✅ Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // ✅ Return only safe, non-sensitive information
    return NextResponse.json({
      email: session.customer_details?.email || null,
      customerId: session.customer || null, // Added Stripe customer ID
    });
  } catch (err) {
    console.error("Error retrieving session:", err.message);
    return NextResponse.json(
      { error: "Invalid session ID" },
      { status: 500 }
    );
  }
}
