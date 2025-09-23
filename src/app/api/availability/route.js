import { NextResponse } from "next/server";

let availability = {
  monday: ["10:00", "14:00"],
  wednesday: ["09:00", "11:00"],
  friday: ["15:00"],
};

export async function GET() {
  return NextResponse.json(availability);
}

export async function POST(req) {
  const data = await req.json();
  availability = data; // overwrite with new data
  return NextResponse.json({ success: true, availability });
}
