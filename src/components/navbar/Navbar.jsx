import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";

const LINKS = [
  { label: "Jualan Online", to: "/kategori/jualan-online" },
  { label: "Marketing", to: "/kategori/marketing" },
  { label: "AI untuk UMKM", to: "/kategori/ai" },
  { label: "Semua Kategori", to: "/kategori" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-xl font-semibold text-ink">
          Exora <span className="text-brand">Academy</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-brand" : "text-ink/70 hover:text-ink"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/search"
            aria-label="Cari artikel"
            className="rounded-full p-2 text-ink/70 transition hover:bg-ink/5 hover:text-ink"
          >
            <Search size={18} />
          </Link>
          <a href="https://myexora.my.id" className="btn-primary hidden sm:inline-flex">
            Coba Exora
          </a>
          <button
            className="rounded-full p-2 text-ink/70 hover:bg-ink/5 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Buka menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink/80 hover:bg-ink/5"
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
