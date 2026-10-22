import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { authError } from "@/lib/adminAuth";
import { destroyAsset, isCloudinaryUrl } from "@/lib/cloudinaryServer";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const items = await db.collection("menu").find().sort({ createdAt: 1 }).toArray();
    return NextResponse.json(items.map((i) => ({ ...i, _id: String(i._id) })));
  } catch { return NextResponse.json({ error: "Database not connected" }, { status: 500 }); }
}

export async function POST(req) {
  const bad = authError(req); if (bad) return bad;
  try {
    const { name, desc, price, category, image, imagePublicId } = await req.json();
    const itemName = String(name || "").trim();
    const itemCategory = String(category || "").trim();
    const itemPrice = Number(price);
    const itemImage = String(image || "").trim();
    const itemImagePublicId = String(imagePublicId || "").trim();
    if (!itemName || !itemCategory || !Number.isFinite(itemPrice) || itemPrice < 0)
      return NextResponse.json({ error: "Name, category and a valid price are required" }, { status: 400 });
    if ((itemImage || itemImagePublicId) && (!itemImage || !itemImagePublicId || !isCloudinaryUrl(itemImage, "image")))
      return NextResponse.json({ error: "Menu images must be uploaded to Cloudinary" }, { status: 400 });
    const db = await getDb();
    const r = await db.collection("menu").insertOne({
      name: itemName, desc: String(desc || "").trim(), price: itemPrice,
      category: itemCategory, image: itemImage, imagePublicId: itemImagePublicId, createdAt: new Date(),
    });
    return NextResponse.json({ ok: true, id: String(r.insertedId) }, { status: 201 });
  } catch { return NextResponse.json({ error: "Database not connected" }, { status: 500 }); }
}

export async function DELETE(req) {
  const bad = authError(req); if (bad) return bad;
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid menu item id" }, { status: 400 });
    const db = await getDb();
    const item = await db.collection("menu").findOne({ _id: new ObjectId(id) });
    await db.collection("menu").deleteOne({ _id: new ObjectId(id) });
    if (item?.imagePublicId) await destroyAsset(item.imagePublicId, "image");
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Could not delete" }, { status: 500 }); }
}
