import crypto from "crypto";
const cfg = () => ({ cloud: process.env.CLOUDINARY_CLOUD_NAME, key: process.env.CLOUDINARY_API_KEY, secret: process.env.CLOUDINARY_API_SECRET });
export function cloudinaryConfigured() { const c = cfg(); return !!(c.cloud && c.key && c.secret); }
export function isCloudinaryUrl(url, resourceType) {
  try {
    const c = cfg();
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === "res.cloudinary.com" && parsed.pathname.startsWith(`/${c.cloud}/${resourceType}/upload/`);
  } catch { return false; }
}
export function signParams(params) {
  const str = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&");
  return crypto.createHash("sha1").update(str + cfg().secret).digest("hex");
}
export function cloudinaryPublic() { const c = cfg(); return { cloudName: c.cloud, apiKey: c.key }; }
// delete an old asset (best effort, never throws)
export async function destroyAsset(publicId, resourceType = "image") {
  try {
    if (!publicId || !cloudinaryConfigured()) return;
    const c = cfg(); const timestamp = Math.floor(Date.now() / 1000);
    const body = new URLSearchParams({ public_id: publicId, timestamp: String(timestamp), api_key: c.key, signature: signParams({ public_id: publicId, timestamp }) });
    await fetch(`https://api.cloudinary.com/v1_1/${c.cloud}/${resourceType}/destroy`, { method: "POST", body });
  } catch {}
}
