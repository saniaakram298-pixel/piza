// Scroll-driven ingredient cutouts.
//  variant="explode": burst outward from the pizza as you scroll  (Layers)
//  variant="fall"   : drop onto the dough one after another       (Dough)
const explode = [
  { img: 0, l: 60, t: 14, size: 86, rot: 220 }, { img: 1, l: 87, t: 16, size: 96, rot: -130 },
  { img: 2, l: 55, t: 66, size: 64, rot: 170 },  { img: 0, l: 91, t: 52, size: 70, rot: -240 },
  { img: 2, l: 80, t: 80, size: 70, rot: 150 },  { img: 1, l: 66, t: 34, size: 70, rot: 100 },
  { img: 0, l: 75, t: 8, size: 56, rot: 300 },
];
const fall = [
  { img: 0, l: 62, t: 52, size: 84, r0: 200, r1: 14 },   { img: 3, l: 72, t: 48, size: 52, r0: -240, r1: 20 },
  { img: 1, l: 78, t: 56, size: 66, r0: 160, r1: -30 },  { img: 2, l: 68, t: 62, size: 78, r0: -180, r1: 8 },
  { img: 4, l: 82, t: 50, size: 96, r0: 220, r1: -12 },  { img: 5, l: 58, t: 60, size: 70, r0: -200, r1: 24 },
  { img: 0, l: 74, t: 66, size: 66, r0: 260, r1: -18 },  { img: 3, l: 64, t: 68, size: 46, r0: -300, r1: 40 },
  { img: 1, l: 84, t: 64, size: 60, r0: 180, r1: 35 },   { img: 4, l: 66, t: 44, size: 84, r0: -160, r1: 6 },
  { img: 2, l: 78, t: 70, size: 56, r0: 240, r1: -25 },  { img: 5, l: 88, t: 58, size: 56, r0: -220, r1: 18 },
];
export default function Floaters({ images = [], variant = "explode" }) {
  if (!images.length) return null;
  const list = variant === "fall" ? fall : explode;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" {...(variant === "fall" ? { "data-reveal": "fall" } : {})}>
      {list.map((it, i) => {
        const style = { left: `${it.l}%`, top: `${it.t}%`, "--size": it.size, "--rot": `${it.rot}deg` };
        if (variant === "explode") { style["--fx"] = `${70 - it.l}vw`; style["--fy"] = `${55 - it.t}vh`; }
        else { style["--rot0"] = `${it.r0}deg`; style["--rot1"] = `${it.r1}deg`; style["--delay"] = `${0.15 + i * 0.22}s`; }
        return (
          <div key={i} className={`scrub ${variant}`} style={style}>
            <img src={images[it.img % images.length]} alt="" className={variant === "explode" ? "bob" : ""} style={variant === "explode" ? { "--d": `${4 + (i % 4)}s`, animationDelay: `${-i}s` } : undefined} />
          </div>
        );
      })}
    </div>
  );
}
