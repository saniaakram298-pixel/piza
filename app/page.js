import Navbar from "@/components/Navbar";
import Section from "@/components/Section";
import Collection from "@/components/Collection";
import ReserveForm from "@/components/ReserveForm";
import ScrollFX from "@/components/ScrollFX";
import ScrollDriver from "@/components/ScrollDriver";
import Footer from "@/components/Footer";
const fire = "radial-gradient(circle at 80% 60%, #8a3a1a 0%, #2a1209 40%, #0a0705 80%)";
const ing = ["/images/tomato.png", "/images/mozzarella.png", "/images/basil.png"];
export const dynamic = "force-dynamic";
export default function Home() {
  return (
    <main>
      <Navbar />
      <ScrollDriver />
      <ScrollFX />
      <Section id="home" smoke title={["Your table", "is waiting."]} text="Wood-fired pizza made the slow way. Hand-stretched dough, bright tomatoes and a fire that never rests." cta="Reserve your table" cta2="View full menu" image="/images/hero.jpg" fallback={fire} />
      <Section id="craft" embers title={["Crafted", "by fire."]} text="Every pizza spends ninety seconds in a 480°C oak-fired oven — blistered crust, molten centre." cta="Reserve your table" image="/images/fire.jpg" fallback={fire} />
      <Section id="layers" scene={240} variant="explode" floaters={ing} title={["Every layer", "matters."]} text="Crushed tomato, fior di latte, fresh basil and olive oil — each layer placed with intent. Keep scrolling." cta="Explore the menu" image="/images/layers.jpg" fallback={fire} />
      <Section id="finished" embers title={["Finished", "by fire."]} text="The last seconds decide everything. Pulled straight from the flame, served while the crust still crackles." cta="Explore the menu" image="/images/finished.jpg" fallback={fire} />
      <Collection />
      <Section id="dough" variant="fall" floaters={["/images/tomato.png", "/images/basil.png", "/images/mozzarella.png", "/images/olive.svg", "/images/pepper.svg", "/images/mushroom.svg"]} flour title={["Simple ingredients.", "Serious craft."]} text="Flour, water, salt, yeast — rested 48 hours. Then the toppings, one by one." cta="Reserve your table" image="/images/dough.jpg" fallback={fire} />
      <Section id="signature" title={["The Fornello", "Signature."]} text="Our margherita, the way it began: slow-rested dough, bright tomato, milk-sweet mozzarella and a single torn basil leaf." cta="Reserve your table" cta2="View full menu" image="/images/signature.jpg" fallback={fire} />
      <ReserveForm />
      <Footer />
    </main>
  );
}
