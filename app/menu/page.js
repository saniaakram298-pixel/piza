import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDb } from "@/lib/mongodb";
import { menuDefaults, groupMenu } from "@/lib/menuDefaults";
import { optimizeImage } from "@/lib/cloudinary";
export const dynamic = "force-dynamic";
export const metadata = { title: "Menu | Fornello" };

async function load() {
  try {
    const db = await getDb();
    const d = await db.collection("menu").find().sort({ createdAt: 1 }).toArray();
    if (d.length) return d.map((i) => ({ ...i, _id: String(i._id) }));
  } catch {}
  return menuDefaults;
}

export default async function MenuPage() {
  const groups = groupMenu(await load());
  return (
    <main className="stone min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-5 pb-24 pt-32 sm:px-8">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-gold">Fornello</p>
        <h1 className="mt-3 text-center font-serif text-4xl uppercase tracking-wide sm:text-5xl md:text-6xl">Our Menu</h1>

        <nav className="mt-8 flex flex-wrap justify-center gap-3">
          {groups.map(([c]) => (
            <a key={c} href={`#${c.replace(/\s+/g, "-")}`} className="rounded-full border border-white/25 px-4 py-2 text-[11px] uppercase tracking-widest transition hover:border-gold hover:text-gold">{c}</a>
          ))}
        </nav>

        {groups.map(([cat, items]) => (
          <section key={cat} id={cat.replace(/\s+/g, "-")} className="mt-16 scroll-mt-28">
            <h2 className="border-b border-white/15 pb-3 font-serif text-2xl uppercase tracking-wide text-gold md:text-3xl">{cat}</h2>
            <div className="mt-6 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {items.map((i) => (
                <article key={i._id} className="flex gap-4">
                  {i.image ? <img src={optimizeImage(i.image, 200)} alt={i.name} className="h-20 w-20 flex-none rounded-full object-cover" /> : null}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-serif text-xl">{i.name}</h3>
                      <span className="mb-1 min-w-4 flex-1 border-b border-dotted border-white/25" />
                      <span className="text-gold">${i.price}</span>
                    </div>
                    {i.desc ? <p className="mt-1 text-sm leading-relaxed text-white/55">{i.desc}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-16 text-center">
          <a href="/#reserve" className="rounded-full bg-gold px-7 py-3 text-xs font-semibold uppercase tracking-widest text-black transition hover:scale-105 hover:bg-ember">Reserve your table</a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
