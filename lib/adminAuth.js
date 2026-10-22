import { NextResponse } from "next/server";
export function authError(req) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return NextResponse.json({ error: "Set ADMIN_PASSWORD in .env.local first" }, { status: 503 });
  if (req.headers.get("x-admin-password") !== pw) return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  return null;
}
