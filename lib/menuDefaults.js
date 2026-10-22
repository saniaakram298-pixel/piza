// Shown when MongoDB is empty / not connected. Real items live in the "menu" collection.
export const CATEGORY_ORDER = ["Pizzas", "Starters", "Desserts", "Drinks"];
export const menuDefaults = [
  { _id: "d1", category: "Pizzas", name: "Margherita", desc: "San Marzano tomato, fior di latte, fresh basil", price: 12, image: "/images/margherita.png" },
  { _id: "d2", category: "Pizzas", name: "Diavola", desc: "Spicy salami, chili oil, mozzarella", price: 14, image: "/images/diavola.png" },
  { _id: "d3", category: "Pizzas", name: "Burrata", desc: "Burrata, cherry tomato, fresh basil", price: 15, image: "/images/burrata.png" },
  { _id: "d4", category: "Pizzas", name: "Verdure", desc: "Olives, mushrooms, bell pepper, tomato, mozzarella", price: 13 },
  { _id: "d5", category: "Starters", name: "Garlic Knots", desc: "Wood-fired dough, garlic butter, parsley", price: 6 },
  { _id: "d6", category: "Starters", name: "Caprese", desc: "Tomato, mozzarella, basil, olive oil", price: 8 },
  { _id: "d7", category: "Desserts", name: "Tiramisu", desc: "Mascarpone, espresso, cocoa", price: 7 },
  { _id: "d8", category: "Desserts", name: "Panna Cotta", desc: "Vanilla cream, berry sauce", price: 6 },
  { _id: "d9", category: "Drinks", name: "Fresh Lemonade", desc: "Lemon, mint, sparkling water", price: 4 },
  { _id: "d10", category: "Drinks", name: "Espresso", desc: "Single or double", price: 3 },
];
export function groupMenu(items) {
  const cats = [...new Set(items.map((i) => i.category || "Other"))];
  cats.sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a), ib = CATEGORY_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
  });
  return cats.map((c) => [c, items.filter((i) => (i.category || "Other") === c)]);
}
