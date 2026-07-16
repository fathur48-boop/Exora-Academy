import { Link } from "react-router-dom";
import SeoHead from "@/components/seo/SeoHead.jsx";
import Button from "@/components/ui/Button.jsx";

export default function NotFound() {
  return (
    <>
      <SeoHead title="Halaman Tidak Ditemukan" description="Halaman yang kamu cari tidak ditemukan." path="/404" noindex />
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-mono text-sm text-brand">404</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Halaman tidak ditemukan</h1>
        <p className="mt-2 max-w-sm text-muted">
          Mungkin artikel ini sudah dipindah atau URL-nya salah ketik.
        </p>
        <Link to="/" className="mt-6">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </div>
    </>
  );
}
