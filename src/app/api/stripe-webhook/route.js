import { NextResponse } from "next/server";

export async function POST(req) {
  // ✅ Skip execution during build
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json(
      { message: "Skipping Stripe webhook at build time" },
      { status: 200 }
    );
  }

  try {
    // ✅ Add your real Stripe webhook logic here
    const body = await req.text();
    // Parse and verify event
    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
