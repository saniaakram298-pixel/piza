const cols = [
  ["Menu", [["Full menu", "/menu"], ["Signature", "/#signature"], ["Reserve", "/#reserve"]]],
  ["Our Pizza", [["Crafted by fire", "/#craft"], ["Every layer", "/#layers"], ["Finished by fire", "/#finished"], ["Our dough", "/#dough"]]],
  ["Reserve", [["Book a table", "/#reserve"], ["Hours: 12pm - 11pm", "/#reserve"], ["Find us", "/#reserve"]]],
];
const socials = [
  ["Instagram", "M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.5-3.2a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z"],
  ["Facebook", "M14 8V6c0-.9.2-1.5 1.6-1.5H17V1.2C16.6 1.1 15.6 1 14.5 1 12 1 10 2.6 10 5.6V8H7v3.6h3V23h4V11.6h3l.5-3.6H14z"],
  ["X", "M18.2 2H21l-6.5 7.4L22 22h-6l-4.7-6.1L5.8 22H3l7-8L2 2h6.1l4.2 5.6L18.2 2zm-1 18h1.6L7 3.7H5.3L17.2 20z"],
  ["YouTube", "M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5 3-5 3z"],
];
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-5 pb-8 pt-14 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <a href="/#home" className="font-serif text-2xl tracking-widest">🔥 FORNELLO</a>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-gold">Crafted by fire</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">Wood-fired pizza made the slow way. Hand-stretched dough, bright tomatoes and a fire that never rests.</p>
        </div>
        {cols.map(([title, links]) => (
          <div key={title}>
            <h3 className="text-xs uppercase tracking-[0.25em] text-white/90">{title}</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/50">
              {links.map(([l, h]) => <li key={l}><a href={h} className="transition hover:text-gold">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-5 border-t border-white/10 pt-6 sm:flex-row">
        <p className="text-center text-[11px] uppercase tracking-widest text-white/40">© 2026 Fornello. All rights reserved.</p>
        <div className="flex gap-3">
          {socials.map(([n, d]) => (
            <a key={n} href="#" aria-label={n} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/60 transition hover:border-gold hover:text-gold">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d={d} /></svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
