import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";

export default function Hero() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <section className="border-b border-line bg-white">
      <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-[1.1fr,0.9fr] lg:py-24">
        <div>
          <p className="eyebrow inline-flex items-center gap-1.5">
            <Sparkles size={13} /> Belajar gratis, langsung praktik
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
            Naikkan omzet UMKM kamu, satu panduan pada satu waktu.
          </h1>
          <p className="mt-4 max-w-lg text-base text-muted">
            Ratusan panduan jualan online, marketing, dan AI yang ditulis khusus buat pelaku usaha
            Indonesia — bukan teori, tapi langkah yang bisa langsung kamu jalankan hari ini.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 flex max-w-md gap-2">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari topik, misal 'copywriting produk'"
                className="w-full rounded-full border border-line bg-paper py-3 pl-10 pr-4 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <button type="submit" className="btn-primary">Cari</button>
          </form>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand/5" />
          <div className="rounded-2xl border border-line bg-paper p-6 font-mono text-xs leading-relaxed text-ink/70 shadow-sm">
            <p className="text-brand">// panduan_populer_minggu_ini.md</p>
            <p className="mt-2">01. Cara Jualan Online Tanpa Modal</p>
            <p>02. Copywriting Produk yang Bikin Klik</p>
            <p>03. ChatGPT untuk UMKM: Mulai dari Mana?</p>
            <p>04. Template Caption Promo Siap Pakai</p>
          </div>
        </div>
      </div>
    </section>
  );
}
