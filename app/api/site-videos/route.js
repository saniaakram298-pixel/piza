import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { authError } from "@/lib/adminAuth";
import { destroyAsset, isCloudinaryUrl } from "@/lib/cloudinaryServer";
import { SECTIONS } from "@/lib/siteVideos";
export const dynamic = "force-dynamic";
const sectionIds = new Set(SECTIONS.map(([id]) => id));

export async function GET() {
  try {
    const db = await getDb();
    return NextResponse.json(await db.collection("site_videos").find().toArray());
  } catch { return NextResponse.json({ error: "Database not connected" }, { status: 500 }); }
}

// save / replace the video of a section (URL already uploaded to Cloudinary by the browser)
export async function POST(req) {
  const bad = authError(req); if (bad) return bad;
  try {
    const { section, url, publicId } = await req.json();
    if (!sectionIds.has(section)) return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    if (!publicId || !isCloudinaryUrl(url, "video")) return NextResponse.json({ error: "Videos must be uploaded to Cloudinary" }, { status: 400 });
    const db = await getDb();
    const col = db.collection("site_videos");
    const old = await col.findOne({ _id: section });
    await col.updateOne({ _id: section }, { $set: { url, publicId: publicId || "", updatedAt: new Date() } }, { upsert: true });
    if (old?.publicId && old.publicId !== publicId) await destroyAsset(old.publicId, "video");
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Database not connected" }, { status: 500 }); }
}

// remove the Cloudinary video -> section goes back to local file / image
export async function DELETE(req) {
  const bad = authError(req); if (bad) return bad;
  try {
    const section = new URL(req.url).searchParams.get("section");
    if (!sectionIds.has(section)) return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    const db = await getDb();
    const old = await db.collection("site_videos").findOne({ _id: section });
    await db.collection("site_videos").deleteOne({ _id: section });
    if (old?.publicId) await destroyAsset(old.publicId, "video");
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Could not delete" }, { status: 500 }); }
}
