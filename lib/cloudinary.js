// Safe for server + client: only rewrites Cloudinary URLs to optimized versions.
const isCld = (u) => typeof u === "string" && u.includes("res.cloudinary.com") && u.includes("/upload/");
export function optimizeImage(url, w = 600) {
  return isCld(url) ? url.replace("/upload/", `/upload/f_auto,q_auto,w_${w}/`) : url;
}
export function optimizeVideo(url) {
  return isCld(url) ? url.replace("/upload/", "/upload/q_auto/") : url;
}
