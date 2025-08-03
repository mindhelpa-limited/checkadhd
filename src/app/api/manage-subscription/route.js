// src/app/api/manage-subscription/route.js
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Manage subscription API placeholder" });
}
