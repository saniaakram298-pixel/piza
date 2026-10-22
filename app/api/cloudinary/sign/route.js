import { NextResponse } from "next/server";
import { authError } from "@/lib/adminAuth";
import { cloudinaryConfigured, cloudinaryPublic, signParams } from "@/lib/cloudinaryServer";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const bad = authError(req); if (bad) return bad;
  if (!cloudinaryConfigured()) return NextResponse.json({ error: "Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to .env.local" }, { status: 503 });
  let folder;
  try { ({ folder } = await req.json()); } catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }
  if (!["fornello/menu", "fornello/videos"].includes(folder)) return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signParams({ folder, timestamp });
  return NextResponse.json({ signature, timestamp, folder, ...cloudinaryPublic() });
}
