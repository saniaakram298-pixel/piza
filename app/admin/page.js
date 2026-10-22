"use client";
import { useEffect, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinaryClient";
import { SECTIONS_LIST } from "./sections";

const input = "w-full rounded-lg border border-white/20 bg-black/40 px-4 py-3 text-sm outline-none focus:border-gold";
const card = "rounded-2xl border border-white/10 bg-black/30 p-5 sm:p-6";
const empty = { name: "", desc: "", price: "", category: "Pizzas" };

function Bar({ value }) {
  if (value == null) return null;
  return <div className="h-1.5 w-full overflow-hidden rounded bg-white/10"><div className="h-full bg-gold transition-all" style={{ width: `${value}%` }} /></div>;
}

export default function Admin() {
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");

  /* ---------- menu items ---------- */
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [prog, setProg] = useState(null);
  const [items, setItems] = useState([]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function loadItems() {
    const r = await fetch("/api/menu", { cache: "no-store" }); const d = await r.json();
    setItems(Array.isArray(d) ? d : []);
    if (!Array.isArray(d)) setMsg("⚠️ " + (d.error || "Could not load menu") + " (check .env.local)");
  }
  function pickImage(e) {
    const f = e.target.files?.[0]; if (!f) return;
    if (!f.type.startsWith("image/")) return setMsg("❌ Please choose an image file");
    if (f.size > 10 * 1024 * 1024) return setMsg("❌ Image must be under 10 MB");
    setFile(f); setPreview(URL.createObjectURL(f)); setMsg("");
  }
  async function addItem(e) {
    e.preventDefault(); setMsg("Saving...");
    try {
      let image = "", imagePublicId = "";
      if (file) {
        setMsg("Uploading image to Cloudinary...");
        const up = await uploadToCloudinary(file, { kind: "image", folder: "fornello/menu", pw, onProgress: setProg });
        image = up.url; imagePublicId = up.publicId;
      }
      const r = await fetch("/api/menu", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-password": pw }, body: JSON.stringify({ ...form, image, imagePublicId }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed");
      setMsg("✅ Item added"); setForm({ ...empty, category: form.category }); setFile(null); setPreview(""); setProg(null); loadItems();
    } catch (err) { setMsg("❌ " + err.message); setProg(null); }
  }
  async function delItem(id) {
    if (!confirm("Delete this item (and its image)?")) return;
    const r = await fetch(`/api/menu?id=${id}`, { method: "DELETE", headers: { "x-admin-password": pw } }); const d = await r.json();
    if (r.ok) { setMsg("🗑️ Deleted"); loadItems(); } else setMsg("❌ " + (d.error || "Failed"));
  }

  /* ---------- section videos ---------- */
  const [videos, setVideos] = useState({});
  const [vprog, setVprog] = useState({});
  async function loadVideos() {
    const r = await fetch("/api/site-videos", { cache: "no-store" }); const d = await r.json();
    if (Array.isArray(d)) setVideos(Object.fromEntries(d.map((x) => [x._id, x])));
  }
  async function uploadVideo(section, f) {
    if (!f) return;
    if (!f.type.startsWith("video/")) return setMsg("❌ Please choose a video file (.mp4 / .webm)");
    if (f.size > 100 * 1024 * 1024) return setMsg("❌ Video must be under 100 MB (Cloudinary free limit)");
    try {
      setMsg(`Uploading video for "${section}"...`); setVprog((p) => ({ ...p, [section]: 0 }));
      const up = await uploadToCloudinary(f, { kind: "video", folder: "fornello/videos", pw, onProgress: (v) => setVprog((p) => ({ ...p, [section]: v })) });
      const r = await fetch("/api/site-videos", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-password": pw }, body: JSON.stringify({ section, ...up }) });
      const d = await r.json(); if (!r.ok) throw new Error(d.error || "Failed to save");
      setMsg("✅ Video saved. Refresh the website to see it."); loadVideos();
    } catch (err) { setMsg("❌ " + err.message); }
    setVprog((p) => { const n = { ...p }; delete n[section]; return n; });
  }
  async function delVideo(section) {
    if (!confirm("Remove this video? The section will go back to its default.")) return;
    const r = await fetch(`/api/site-videos?section=${section}`, { method: "DELETE", headers: { "x-admin-password": pw } });
    const d = await r.json(); if (r.ok) { setMsg("🗑️ Video removed"); loadVideos(); } else setMsg("❌ " + (d.error || "Failed"));
  }

  useEffect(() => { loadItems(); loadVideos(); }, []);
  const cats = [...new Set(items.map((i) => i.category))];

  return (
    <main className="min-h-screen bg-[#0d0b09] px-5 py-12 text-[#f3e9dc] sm:px-8">
      <div className="mx-auto max-w-3xl space-y-10">
        <div>
          <a href="/menu" className="text-xs uppercase tracking-widest text-gold">← View menu</a>
          <h1 className="mt-3 font-serif text-3xl uppercase sm:text-4xl">Admin</h1>
          <input type="password" placeholder="Admin password" value={pw} onChange={(e) => setPw(e.target.value)} className={`${input} mt-5`} />
          {msg && <p className="mt-3 rounded-lg bg-white/5 px-4 py-3 text-sm text-white/80">{msg}</p>}
        </div>

        {/* ---- Add menu item ---- */}
        <section>
          <h2 className="font-serif text-2xl uppercase">Add menu item</h2>
          <form onSubmit={addItem} className={`${card} mt-4 grid gap-4`}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input placeholder="Item name" value={form.name} onChange={set("name")} className={input} required />
              <input type="number" step="0.01" min="0" placeholder="Price ($)" value={form.price} onChange={set("price")} className={input} required />
            </div>
            <input list="cats" placeholder="Category (Pizzas, Starters, Desserts, Drinks...)" value={form.category} onChange={set("category")} className={input} required />
            <datalist id="cats">{["Pizzas", "Starters", "Desserts", "Drinks", ...cats].map((c) => <option key={c} value={c} />)}</datalist>
            <textarea placeholder="Description" value={form.desc} onChange={set("desc")} rows={2} className={input} />
            <div className="flex items-center gap-4">
              {preview ? <img src={preview} alt="" className="h-20 w-20 flex-none rounded-full object-cover" /> : <div className="grid h-20 w-20 flex-none place-items-center rounded-full border border-dashed border-white/25 text-[10px] text-white/40">no image</div>}
              <label className="flex-1 cursor-pointer rounded-lg border border-white/20 bg-black/40 px-4 py-3 text-sm text-white/70 hover:border-gold">
                {file ? file.name : "Choose image (JPG / PNG / WebP, max 10 MB)"}
                <input type="file" accept="image/*" onChange={pickImage} className="hidden" />
              </label>
            </div>
            <Bar value={prog} />
            <button className="rounded-full bg-gold py-3 text-xs font-semibold uppercase tracking-widest text-black hover:bg-ember">Add to menu</button>
          </form>

          <h3 className="mt-8 font-serif text-xl uppercase">Current items ({items.length})</h3>
          {items.length === 0 && <p className="mt-2 text-sm text-white/50">No items in the database yet. The public menu shows sample items until you add your first one.</p>}
          <ul className="mt-3 divide-y divide-white/10 rounded-2xl border border-white/10">
            {items.map((i) => (
              <li key={i._id} className="flex items-center gap-3 px-4 py-3">
                {i.image ? <img src={i.image} alt="" className="h-12 w-12 flex-none rounded-full object-cover" /> : <div className="h-12 w-12 flex-none rounded-full bg-white/5" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-lg">{i.name} <span className="text-gold">${i.price}</span></p>
                  <p className="truncate text-xs text-white/45">{i.category}{i.desc ? ` · ${i.desc}` : ""}</p>
                </div>
                <button onClick={() => delItem(i._id)} className="rounded-full border border-red-400/40 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10">Delete</button>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- Section videos ---- */}
        <section>
          <h2 className="font-serif text-2xl uppercase">Website videos</h2>
          <p className="mt-2 text-sm text-white/50">Upload a video for each section. It is stored on Cloudinary and the link is saved in MongoDB. No upload = the section keeps its default video / image.</p>
          <div className="mt-4 space-y-3">
            {SECTIONS_LIST.map(([id, label]) => {
              const v = videos[id];
              return (
                <div key={id} className={`${card} !p-4`}>
                  <div className="flex flex-wrap items-center gap-3">
                    {v?.url ? <video src={v.url} muted loop playsInline autoPlay className="h-16 w-28 flex-none rounded-lg object-cover" /> : <div className="grid h-16 w-28 flex-none place-items-center rounded-lg border border-dashed border-white/20 text-[10px] text-white/40">default</div>}
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-lg">{label}</p>
                      <p className="text-xs text-white/40">{v?.url ? "Cloudinary video active" : "Using default"}</p>
                    </div>
                    <label className="cursor-pointer rounded-full border border-white/25 px-4 py-2 text-xs uppercase tracking-widest hover:border-gold hover:text-gold">
                      {v?.url ? "Replace" : "Upload"}
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => { uploadVideo(id, e.target.files?.[0]); e.target.value = ""; }} />
                    </label>
                    {v?.url && <button onClick={() => delVideo(id)} className="rounded-full border border-red-400/40 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10">Remove</button>}
                  </div>
                  <div className="mt-3"><Bar value={vprog[id]} /></div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
