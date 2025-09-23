import { NextResponse } from "next/server";

export async function GET() {
  const payouts = [
    { id: "p1", amount: 1200, date: "2025-09-01", status: "Paid" },
    { id: "p2", amount: 850, date: "2025-08-01", status: "Paid" },
    { id: "p3", amount: 1200, date: "2025-07-01", status: "Paid" },
    { id: "p4", amount: 900, date: "2025-09-15", status: "Pending" },
  ];

  return NextResponse.json(payouts);
}
