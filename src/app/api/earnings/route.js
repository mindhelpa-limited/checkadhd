import { NextResponse } from "next/server";

export async function GET() {
  const earnings = {
    total: 3250,
    monthly: [
      { month: "June", amount: 1200 },
      { month: "July", amount: 850 },
      { month: "August", amount: 1200 },
    ],
  };
  return NextResponse.json(earnings);
}
