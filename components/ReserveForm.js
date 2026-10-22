"use client";
import { useState } from "react";
const input = "w-full rounded-lg border border-white/20 bg-black/40 px-4 py-3 text-sm outline-none focus:border-gold";
export default function ReserveForm() {
  const [status, setStatus] = useState("");
  async function submit(e) {
    e.preventDefault();
    setStatus("Sending...");
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save reservation");
      setStatus("Table reserved! See you soon."); form.reset();
    } catch (error) {
      setStatus(error.message || "Could not connect to the reservation service.");
    }
  }
  return (
    <section id="reserve" className="bg-[#14100c] px-5 py-20 sm:px-8 md:py-28">
      <div className="mx-auto max-w-xl text-center">
        <h2 data-reveal className="font-serif text-3xl uppercase sm:text-4xl md:text-5xl">Reserve Your Table</h2>
        <form data-reveal data-delay="1" onSubmit={submit} className="mt-10 grid gap-4 text-left">
          <input name="name" placeholder="Full name" required className={input} />
          <input name="phone" placeholder="Phone" required className={input} />
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="date" type="date" required className={input} />
            <input name="time" type="time" required className={input} />
          </div>
          <input name="guests" type="number" min="1" max="20" placeholder="Guests" required className={input} />
          <button className="rounded-full bg-gold py-3 text-xs font-semibold uppercase tracking-widest text-black hover:bg-ember">Confirm Reservation</button>
          {status && <p className="text-center text-sm text-white/70">{status}</p>}
        </form>
      </div>
    </section>
  );
}
