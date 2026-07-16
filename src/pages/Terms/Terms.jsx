import SeoHead from "@/components/seo/SeoHead.jsx";

export default function Terms() {
  return (
    <>
      <SeoHead title="Syarat & Ketentuan" description="Syarat dan ketentuan penggunaan Exora Academy." path="/terms" />
      <div className="container-page max-w-2xl py-14">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Syarat & Ketentuan</h1>
        <div className="prose-article mt-6">
          <p>
            Dengan mengakses dan menggunakan Exora Academy, kamu setuju dengan syarat dan ketentuan
            berikut.
          </p>
          <h2>Penggunaan Konten</h2>
          <p>
            Seluruh konten di situs ini disediakan untuk keperluan edukasi. Dilarang menyalin atau
            mendistribusikan ulang tanpa izin tertulis.
          </p>
        </div>
      </div>
    </>
  );
}
