"use client";
import { useEffect, useState } from "react";
const dots = ["home", "craft", "layers", "finished", "collection", "dough", "signature", "reserve"];
export default function ScrollFX() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.15 });
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    const so = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { threshold: 0.35 });
    dots.forEach((id) => { const el = document.getElementById(id); el && so.observe(el); });
    return () => { io.disconnect(); so.disconnect(); };
  }, []);
  return (
    <>
      <div className="progress fixed inset-x-0 top-0 z-[60] h-[2px] bg-gold" />
      {/* bottom-centre pagination dots, like the video */}
      <nav className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-2.5 rounded-full bg-black/30 px-3 py-2 backdrop-blur-sm">
        {dots.map((id) => (
          <a key={id} href={`#${id}`} aria-label={id}
            className={`h-1.5 rounded-full transition-all duration-500 ${active === id ? "w-6 bg-gold" : "w-1.5 bg-white/45 hover:bg-white/80"}`} />
        ))}
      </nav>
    </>
  );
}
