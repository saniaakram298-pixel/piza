"use client";
import { useEffect, useState } from "react";
export default function Particles({ count = 22, color = "#ffb347" }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(Array.from({ length: count }, () => ({
      left: Math.random() * 100, size: 2 + Math.random() * 4,
      dur: 5 + Math.random() * 7, delay: Math.random() * 8,
    })));
  }, [count]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p, i) => (
        <span key={i} className="ember" style={{ left: `${p.left}%`, width: p.size, height: p.size, background: color,
          boxShadow: `0 0 ${p.size * 3}px ${color}`, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }} />
      ))}
    </div>
  );
}
