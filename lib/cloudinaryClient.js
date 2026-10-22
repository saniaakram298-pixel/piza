// Browser-side: signed direct upload to Cloudinary (supports big videos, shows progress)
export async function uploadToCloudinary(file, { kind = "image", folder, pw, onProgress }) {
  const sr = await fetch("/api/cloudinary/sign", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-password": pw }, body: JSON.stringify({ folder }) });
  const s = await sr.json();
  if (!sr.ok) throw new Error(s.error || "Could not get upload signature");
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("file", file); fd.append("api_key", s.apiKey); fd.append("timestamp", s.timestamp);
    fd.append("signature", s.signature); fd.append("folder", folder);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${s.cloudName}/${kind}/upload`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      try {
        const r = JSON.parse(xhr.responseText);
        if (xhr.status < 300) resolve({ url: r.secure_url, publicId: r.public_id });
        else reject(new Error(r.error?.message || "Upload failed"));
      } catch { reject(new Error("Upload failed")); }
    };
    xhr.onerror = () => reject(new Error("Network error while uploading"));
    xhr.send(fd);
  });
}
