import { MongoClient } from "mongodb";
import fs from "fs";
const env = Object.fromEntries(fs.readFileSync(".env.local", "utf8").split(/\r?\n/).filter((l) => l.includes("=") && !l.startsWith("#")).map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
const c = await new MongoClient(env.MONGODB_URI).connect();
const db = c.db(env.MONGODB_DB || "fornello");
const pizzas = [
  { name: "Margherita", desc: "San Marzano tomato, fior di latte, basil", price: 12, image: "/images/margherita.png" },
  { name: "Diavola", desc: "Spicy salami, chili oil, mozzarella", price: 14, image: "/images/diavola.png" },
  { name: "Burrata", desc: "Burrata, cherry tomato, fresh basil", price: 15, image: "/images/burrata.png" },
];
const menu = [
  ...pizzas.map((p) => ({ ...p, category: "Pizzas" })),
  { category: "Pizzas", name: "Verdure", desc: "Olives, mushrooms, bell pepper, tomato, mozzarella", price: 13, image: "" },
  { category: "Starters", name: "Garlic Knots", desc: "Wood-fired dough, garlic butter, parsley", price: 6, image: "" },
  { category: "Starters", name: "Caprese", desc: "Tomato, mozzarella, basil, olive oil", price: 8, image: "" },
  { category: "Desserts", name: "Tiramisu", desc: "Mascarpone, espresso, cocoa", price: 7, image: "" },
  { category: "Desserts", name: "Panna Cotta", desc: "Vanilla cream, berry sauce", price: 6, image: "" },
  { category: "Drinks", name: "Fresh Lemonade", desc: "Lemon, mint, sparkling water", price: 4, image: "" },
  { category: "Drinks", name: "Espresso", desc: "Single or double", price: 3, image: "" },
].map((m, i) => ({ ...m, createdAt: new Date(Date.now() + i) }));
await db.collection("menu").deleteMany({}); await db.collection("menu").insertMany(menu);
console.log("Seeded menu"); await c.close();
