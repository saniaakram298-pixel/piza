import fs from "fs";
import path from "path";
import { cache } from "react";
import { getDb } from "./mongodb";
import { optimizeVideo } from "./cloudinary";

export const SECTIONS = [
  ["home", "Hero — Your table is waiting"],
  ["craft", "Crafted by fire"],
  ["layers", "Every layer matters"],
  ["finished", "Finished by fire"],
  ["collection", "The Collection"],
  ["dough", "Simple ingredients. Serious craft."],
  ["signature", "The Fornello Signature"],
];

// one DB read per request
const dbMap = cache(async () => {
  try {
    const db = await getDb();
    const d = await db.collection("site_videos").find().toArray();
    return Object.fromEntries(d.map((x) => [x._id, x]));
  } catch { return {}; }
});

// Priority: Cloudinary URL from MongoDB  ->  local /public/videos/<id>.mp4  ->  null (use the image)
export async function getVideoSrc(id) {
  const m = await dbMap();
  if (m[id]?.url) return optimizeVideo(m[id].url);
  try { if (fs.existsSync(path.join(process.cwd(), "public", "videos", `${id}.mp4`))) return `/videos/${id}.mp4`; } catch {}
  return null;
}
