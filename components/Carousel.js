"use client";
import { useEffect, useRef, useState } from "react";

// Pizzas lie on a table (tilted with rotateX), spin slowly, and swing in 3D as the carousel moves.
export default function Carousel({ items }) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef(null);
  const go = (dir) => setActive((a) => (a + dir + n) % n);
  useEffect(() => {
    if (paused || n < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % n), 3200);
    return () => clearInterval(t);
  }, [paused, n]);
  const pos = (i) => { let d = (i - active + n) % n; if (d > n / 2) d -= n; return d; };

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative mx-auto mt-6 h-[min(78vw,44svh)] max-w-6xl touch-pan-y select-none md:mt-8 md:h-[min(40vw,50svh)]"
        onPointerDown={(e) => { startX.current = e.clientX; }}
        onPointerUp={(e) => { if (startX.current == null) return; const dx = e.clientX - startX.current; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); startX.current = null; }}>

        {/* small pizzas drifting at the back */}
        <img src={items[0].image} alt="" className="mini left-[24%] top-[2%] w-10 md:w-16" style={{ "--d": "6s" }} />
        <img src={items[1 % n].image} alt="" className="mini left-[56%] top-[0%] w-8 md:w-14" style={{ "--d": "7.5s" }} />
        <img src={items[2 % n].image} alt="" className="mini left-[76%] top-[6%] w-8 md:w-12" style={{ "--d": "5.5s" }} />

        {items.map((p, i) => {
          const d = pos(i);
          const hidden = Math.abs(d) > 1;
          const center = d === 0;
          return (
            <button key={p.name} onClick={() => setActive(i)} aria-label={p.name} draggable={false}
              className="absolute left-1/2 top-[58%] w-[min(54vw,34svh)] transition-all duration-[1000ms] ease-[cubic-bezier(.2,.7,.2,1)] md:w-[min(30vw,44svh)]"
              style={{
                transform: `translate(calc(-50% + ${d * 74}%), -50%) scale(${center ? 1.05 : 0.68})`,
                opacity: hidden ? 0 : center ? 1 : 0.85, zIndex: center ? 10 : 5,
                pointerEvents: hidden ? "none" : "auto",
              }}>
              {/* floor shadow */}
              <span className="absolute left-[8%] right-[8%] top-[62%] h-[34%] rounded-[50%] bg-black/80 blur-2xl" />
              {/* the pizza lying on the table */}
              <span className="block" style={{ transform: `perspective(900px) rotateX(58deg) rotateZ(${d * -35}deg)`, transition: "transform 1s cubic-bezier(.2,.7,.2,1)" }}>
                <img src={p.image} alt={p.name} draggable={false} className="block w-full"
                  style={{ animation: "spin 30s linear infinite", filter: "drop-shadow(0 18px 18px rgba(0,0,0,.6))" }} />
              </span>
              <span className={`absolute left-0 right-0 top-[6%] -translate-y-full font-serif text-lg transition-opacity duration-500 md:text-xl ${center ? "opacity-0" : "opacity-70"}`}>{p.name}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 text-center">
        <h3 key={items[active].name + "t"} data-reveal className="in font-serif text-2xl md:text-3xl">{items[active].name}</h3>
        <p key={items[active].name} data-reveal data-delay="1" className="in mx-auto mt-2 max-w-sm px-4 text-sm text-white/60">{items[active].desc}</p>
        <p className="mt-1 text-gold">${items[active].price}</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <button onClick={() => go(-1)} aria-label="previous" className="grid h-9 w-9 place-items-center rounded-full border border-white/25 transition hover:border-gold hover:text-gold">‹</button>
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} aria-label={`slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-gold" : "w-2 bg-white/30"}`} />
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="next" className="grid h-9 w-9 place-items-center rounded-full border border-white/25 transition hover:border-gold hover:text-gold">›</button>
        </div>
      </div>
    </div>
  );
}
