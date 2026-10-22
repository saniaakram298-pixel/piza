import { getVideoSrc } from "@/lib/siteVideos";
import { getDb } from "@/lib/mongodb";
import Carousel from "./Carousel";
const fallback = [
  { name: "Margherita", desc: "San Marzano tomato, fior di latte, basil", price: 12, image: "/images/margherita.png" },
  { name: "Diavola", desc: "Spicy salami, chili oil, mozzarella", price: 14, image: "/images/diavola.png" },
  { name: "Burrata", desc: "Burrata, cherry tomato, fresh basil", price: 15, image: "/images/burrata.png" },
];
export default async function Collection() {
  let items = fallback;
  try {
    const db = await getDb();
    const d = await db.collection("menu").find({ category: "Pizzas" }).sort({ createdAt: 1 }).toArray();
    if (d.length) items = d.map(({ name, desc, price, image }) => ({ name, desc, price, image }));
  } catch {}
  const videoSrc = await getVideoSrc("collection");
  const video = !!videoSrc;

  if (video) {
    // 3D video of the pizzas is the background; names + prices sit on top
    return (
      <section id="collection" className="relative flex min-h-[100svh] flex-col items-center overflow-hidden bg-black px-5 pb-24 pt-28 sm:px-8">
        <video className="absolute inset-0 h-full w-full object-cover" src={videoSrc} autoPlay muted loop playsInline preload="auto" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
        <h2 data-reveal className="relative text-center font-serif text-3xl uppercase tracking-wide sm:text-4xl md:text-5xl lg:text-6xl">The Collection</h2>
        <div className="relative mt-auto grid w-full max-w-4xl grid-cols-3 gap-4 text-center">
          {items.map((p) => (
            <div key={p.name} data-reveal>
              <h3 className="font-serif text-lg md:text-2xl">{p.name}</h3>
              <p className="mt-1 hidden text-xs text-white/60 sm:block">{p.desc}</p>
              <p className="mt-1 text-gold">${p.price}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="collection" className="stone flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 py-20 sm:px-8">
      <h2 data-reveal className="text-center font-serif text-3xl uppercase tracking-wide sm:text-4xl md:text-5xl lg:text-6xl">The Collection</h2>
      <Carousel items={items} />
    </section>
  );
}
