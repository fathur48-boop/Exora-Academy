import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold text-ink">
            Exora <span className="text-brand">Academy</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Panduan praktis jualan online, marketing, dan AI untuk pelaku UMKM Indonesia.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-3">Kategori</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link to="/kategori/jualan-online" className="hover:text-brand">Jualan Online</Link></li>
            <li><Link to="/kategori/marketing" className="hover:text-brand">Marketing</Link></li>
            <li><Link to="/kategori/ai" className="hover:text-brand">AI untuk UMKM</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-3">Perusahaan</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link to="/about" className="hover:text-brand">Tentang Kami</Link></li>
            <li><Link to="/contact" className="hover:text-brand">Kontak</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-3">Legal</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link to="/privacy" className="hover:text-brand">Kebijakan Privasi</Link></li>
            <li><Link to="/terms" className="hover:text-brand">Syarat & Ketentuan</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-5">
        <p className="container-page text-xs text-muted">
          © {new Date().getFullYear()} Exora Academy. Bagian dari ekosistem Exora.
        </p>
      </div>
    </footer>
  );
}
