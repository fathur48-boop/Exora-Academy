import { Link } from "react-router-dom";
import PageHeader from "@/components/admin/PageHeader.jsx";
import { Card } from "@/components/ui/Card.jsx";
import { useAsync } from "@/hooks/useAsync.js";
import { listAllArticles } from "@/services/articles.js";

export default function Dashboard() {
  const { data: articles } = useAsync(() => listAllArticles(), []);

  const published = articles?.filter((a) => a.status === "published") || [];
  const drafts = articles?.filter((a) => a.status === "draft") || [];
  const totalViews = articles?.reduce((sum, a) => sum + (a.views || 0), 0) || 0;

  const stats = [
    { label: "Artikel Published", value: published.length },
    { label: "Draft", value: drafts.length },
    { label: "Total Views", value: totalViews.toLocaleString("id-ID") },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Ringkasan konten Exora Academy."
        action={
          <Link to="/admin/artikel/baru" className="btn-primary">
            Tambah Artikel
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 font-display text-3xl font-semibold text-ink">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-semibold text-ink">Artikel Terbaru</h2>
        <div className="mt-3 divide-y divide-line rounded-2xl border border-line bg-white">
          {(articles || []).slice(0, 6).map((a) => (
            <Link key={a.id} to={`/admin/artikel/${a.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-ink/[0.015]">
              <span className="text-sm font-medium text-ink">{a.title}</span>
              <span className={`text-xs font-medium ${a.status === "published" ? "text-brand" : "text-accent"}`}>
                {a.status === "published" ? "Published" : "Draft"}
              </span>
            </Link>
          ))}
          {articles?.length === 0 && <p className="px-5 py-8 text-center text-sm text-muted">Belum ada artikel.</p>}
        </div>
      </div>
    </>
  );
}
