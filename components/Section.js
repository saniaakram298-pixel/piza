import { getVideoSrc } from "@/lib/siteVideos";
import Particles from "./Particles";
import Floaters from "./Floaters";

function SplitTitle({ lines }) {
  let n = 0;
  return lines.map((line, li) => (
    <span key={li} className="block">
      {line.split(" ").map((w) => (
        <span key={w + n} className="word mr-[.25em]"><span style={{ "--wd": `${0.1 * n++}s` }}>{w}</span></span>
      ))}
    </span>
  ));
}

export default async function Section({ id, title, text, cta, cta2, image, fallback, align = "left", effect = "kenburns", smoke = false, embers = false, flour = false, floaters = [], variant = "explode", scene = 0 }) {
  const videoSrc = await getVideoSrc(id);
  const video = !!videoSrc;
  const tall = scene > 0 && !video;
  return (
    <section id={id} data-scene className="relative" style={tall ? { height: `${scene}svh` } : undefined}>
      <div className={`${tall ? "sticky top-0 h-[100svh]" : "relative min-h-[100svh]"} flex items-end overflow-hidden md:items-center`}>
        {video ? (
          <video className="absolute inset-0 h-full w-full object-cover object-[72%_center] md:object-right"
            src={videoSrc} poster={image} autoPlay muted loop playsInline preload="auto" />
        ) : (
          <div className="absolute inset-0 will-change-transform"
            style={{ transform: "translate3d(0, calc((var(--sp, .5) - .5) * -70px), 0) scale(calc(1.08 + var(--p, 0) * .12))" }}>
            <div className={`absolute inset-0 bg-cover bg-[position:72%_center] md:bg-[position:right_center] ${effect}`}
              style={{ backgroundImage: `url(${image}), ${fallback}` }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5 md:bg-gradient-to-r md:from-black/80 md:via-black/30 md:to-transparent" />
        {!video && smoke && (
          <div className="pointer-events-none absolute bottom-[30%] right-[4%] h-64 w-[70%] md:bottom-[18%] md:right-[8%] md:w-[45%]">
            {[0, 1, 2, 3].map((i) => <span key={i} className="smoke" style={{ left: `${i * 22}%`, width: 120, height: 120, animationDelay: `${i * 1.7}s` }} />)}
          </div>
        )}
        {!video && embers && <Particles count={26} color="#ffa63d" />}
        {!video && flour && <Particles count={30} color="#f5ead8" />}
        {!video && <Floaters images={floaters} variant={variant} />}
        <div className={`relative mx-auto w-full max-w-7xl px-5 pb-20 pt-28 sm:px-8 md:pb-0 md:pt-24 ${align === "right" ? "text-right" : ""}`}
          style={tall ? { transform: "translate3d(0, calc((.5 - var(--p, 0)) * 40px), 0)" } : undefined}>
          <div className={`max-w-sm sm:max-w-md lg:max-w-2xl ${align === "right" ? "ml-auto" : ""}`}>
            <h2 data-reveal="split" className="font-serif text-4xl font-bold uppercase leading-[1.05] sm:text-5xl lg:text-6xl xl:text-7xl">
              <SplitTitle lines={title} />
            </h2>
            <p data-reveal data-delay="2" className="mt-4 max-w-md text-sm leading-relaxed text-white/75 md:mt-5">{text}</p>
            <div data-reveal data-delay="3" className="mt-6 flex flex-wrap gap-3 md:mt-8">
              {cta && <a href="#reserve" className="rounded-full bg-gold px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-black transition hover:scale-105 hover:bg-ember sm:px-6 sm:text-xs">{cta}</a>}
              {cta2 && <a href="/menu" className="rounded-full border border-white/40 px-5 py-3 text-[11px] uppercase tracking-widest transition hover:scale-105 hover:border-gold hover:text-gold sm:px-6 sm:text-xs">{cta2}</a>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
