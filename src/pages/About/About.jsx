import SeoHead from "@/components/seo/SeoHead.jsx";

export default function About() {
  return (
    <>
      <SeoHead title="Tentang Kami" description="Exora Academy — bagian dari ekosistem Exora untuk UMKM Indonesia." path="/about" />
      <div className="container-page max-w-2xl py-14">
        <p className="eyebrow">Tentang Kami</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
          Belajar bareng, jualan makin jalan
        </h1>
        <div className="prose-article mt-6">
          <p>
            Exora Academy adalah pusat belajar untuk pelaku UMKM Indonesia yang ingin naik kelas —
            mulai dari jualan online, strategi marketing, sampai memanfaatkan AI untuk bisnis
            sehari-hari.
          </p>
          <p>
            Kami bagian dari ekosistem Exora, platform yang membantu UMKM mengelola toko online,
            pesanan, dan stok dalam satu tempat. Lewat Exora Academy, kami berbagi ilmu praktis
            yang sudah terbukti dipakai oleh ribuan pelaku usaha.
          </p>
        </div>
      </div>
    </>
  );
}
