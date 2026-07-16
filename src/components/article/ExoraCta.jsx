import { ArrowUpRight } from "lucide-react";

export default function ExoraCta({
  eyebrow = "Exora",
  title = "Udah paham teorinya? Saatnya praktik jualan online.",
  description = "Exora bantu kamu bikin toko online, catat pesanan, sampai kelola stok — dalam satu aplikasi buat UMKM.",
  href = "https://myexora.com",
}) {
  return (
    <section className="flex flex-col items-start gap-5 rounded-2xl border border-line bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="mt-1.5 font-display text-xl font-semibold text-ink">{title}</h3>
        <p className="mt-1.5 max-w-md text-sm text-muted">{description}</p>
      </div>
      <a href={href} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0">
        Coba Exora Gratis
        <ArrowUpRight size={16} />
      </a>
    </section>
  );
}
