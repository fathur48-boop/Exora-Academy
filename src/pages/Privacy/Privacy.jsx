import SeoHead from "@/components/seo/SeoHead.jsx";

export default function Privacy() {
  return (
    <>
      <SeoHead title="Kebijakan Privasi" description="Kebijakan privasi Exora Academy." path="/privacy" />
      <div className="container-page max-w-2xl py-14">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Kebijakan Privasi</h1>
        <div className="prose-article mt-6">
          <p>
            Halaman ini menjelaskan bagaimana Exora Academy mengumpulkan, menggunakan, dan
            melindungi data pengunjung situs.
          </p>
          <h2>Data yang Kami Kumpulkan</h2>
          <p>
            Kami dapat mengumpulkan data seperti alamat email (saat mendaftar newsletter) dan data
            penggunaan situs melalui alat analitik.
          </p>
          <h2>Penggunaan Data</h2>
          <p>Data digunakan untuk meningkatkan kualitas konten dan pengalaman pengguna di situs ini.</p>
        </div>
      </div>
    </>
  );
}
