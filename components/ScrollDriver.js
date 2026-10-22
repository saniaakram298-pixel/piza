"use client";
import { useEffect } from "react";
// Writes scroll progress into CSS variables so animations follow the scrollbar:
//  --p  : 0..1 progress through a tall "scene" (or through the viewport for normal sections)
//  --sp : 0..1 progress of the section crossing the viewport (used for parallax)
//  --scroll (on <html>) : page scroll progress
export default function ScrollDriver() {
  useEffect(() => {
    const els = [...document.querySelectorAll("[data-scene]")];
    const clamp = (v) => Math.min(1, Math.max(0, v));
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const doc = document.documentElement;
      doc.style.setProperty("--scroll", clamp(window.scrollY / Math.max(1, doc.scrollHeight - vh)).toFixed(4));
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) return;
        const sp = clamp((vh - r.top) / (vh + r.height));
        const span = r.height - vh;
        const p = span > 10 ? clamp(-r.top / span) : sp;
        el.style.setProperty("--sp", sp.toFixed(4));
        el.style.setProperty("--p", p.toFixed(4));
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);
  return null;
}
