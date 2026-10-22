"use client";
import { useState } from "react";
const links = [["Menu", "/menu"], ["Our Pizza", "/#layers"], ["Story", "/#craft"], ["Reserve", "/#reserve"]];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav-in fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 md:py-4">
        <a href="/" className="flex items-center gap-2 font-serif text-lg tracking-widest sm:text-xl">
          <span className="text-gold">🔥</span> FORNELLO
        </a>
        <nav className="hidden gap-8 text-xs uppercase tracking-[0.2em] text-white/80 md:flex lg:gap-10">
          {links.map(([l, h]) => <a key={l} href={h} className="hover:text-gold">{l}</a>)}
        </nav>
        <button onClick={() => setOpen(!open)} aria-label="menu" aria-expanded={open} className="grid h-9 w-9 place-items-center rounded-full border border-white/30 text-lg">{open ? "✕" : "≡"}</button>
      </div>
      {open && (
        <nav className="flex flex-col gap-5 border-t border-white/10 bg-black/95 px-5 py-6 text-sm uppercase tracking-widest sm:px-8 md:hidden">
          {links.map(([l, h]) => <a key={l} href={h} onClick={() => setOpen(false)}>{l}</a>)}
        </nav>
      )}
    </header>
  );
}
