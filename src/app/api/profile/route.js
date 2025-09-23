// src/app/api/profile/route.js

import { NextResponse } from "next/server";

// Handle GET requests
export async function GET() {
  return NextResponse.json({ message: "Profile API is working" });
}

// Handle POST requests
export async function POST(req) {
  try {
    const body = await req.json();
    return NextResponse.json({ message: "Profile saved", data: body });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
