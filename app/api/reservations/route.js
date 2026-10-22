import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { authError } from "@/lib/adminAuth";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { name, phone, date, time, guests } = await req.json();
    const cleanName = String(name || "").trim();
    const cleanPhone = String(phone || "").trim();
    const guestCount = Number(guests);
    if (!cleanName || !cleanPhone || !date || !time || !Number.isInteger(guestCount) || guestCount < 1 || guestCount > 20)
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    const db = await getDb();
    const r = await db.collection("reservations").insertOne({ name: cleanName, phone: cleanPhone, date: String(date), time: String(time), guests: guestCount, createdAt: new Date() });
    return NextResponse.json({ ok: true, id: r.insertedId }, { status: 201 });
  } catch (e) {
    console.error("Reservation error:", e.message);
    return NextResponse.json({ error: "Database not connected" }, { status: 500 });
  }
}

export async function GET(req) {
  const bad = authError(req); if (bad) return bad;
  try {
    const db = await getDb();
    return NextResponse.json(await db.collection("reservations").find().sort({ createdAt: -1 }).limit(50).toArray());
  } catch (e) {
    return NextResponse.json({ error: "Database not connected" }, { status: 500 });
  }
}
