import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function CategoryGrid({ categories }) {
  if (!categories?.length) return null;
  return (
    <section className="container-page py-14">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-ink">Kategori Populer</h2>
        <Link to="/kategori" className="text-sm font-medium text-brand hover:underline">
          Lihat semua
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/kategori/${cat.slug}`}
            className="group flex items-center justify-between rounded-2xl border border-line bg-white p-5 transition hover:border-brand"
          >
            <div>
              <p className="font-display text-lg font-semibold text-ink group-hover:text-brand">{cat.name}</p>
              {cat.description && <p className="mt-1 text-sm text-muted">{cat.description}</p>}
            </div>
            <ArrowUpRight size={18} className="shrink-0 text-muted group-hover:text-brand" />
          </Link>
        ))}
      </div>
    </section>
  );
}
