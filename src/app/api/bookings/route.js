import { NextResponse } from "next/server";

export async function GET(req) {
  // TODO: Fetch from database (Firebase, Prisma, etc.)
  const bookings = [
    { id: "b1", client: "Jane Doe", date: "2025-09-10T14:00:00Z", status: "Confirmed", price: 100 },
    { id: "b2", client: "Michael Smith", date: "2025-09-11T10:00:00Z", status: "Pending", price: 120 },
    { id: "b3", client: "Amina Bello", date: "2025-09-12T16:30:00Z", status: "Completed", price: 90 },
  ];

  return NextResponse.json(bookings);
}
