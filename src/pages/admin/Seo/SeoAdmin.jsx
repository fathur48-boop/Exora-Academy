import PageHeader from "@/components/admin/PageHeader.jsx";
import DataTable from "@/components/admin/DataTable.jsx";
import { Badge } from "@/components/ui/Card.jsx";
import { useAsync } from "@/hooks/useAsync.js";
import { listAllArticles } from "@/services/articles.js";

export default function SeoAdmin() {
  const { data: articles, isLoading } = useAsync(() => listAllArticles({ status: "published" }), []);

  const columns = [
    { key: "title", header: "Artikel", render: (row) => <span className="font-medium">{row.title}</span> },
    {
      key: "meta_title",
      header: "Meta Title",
      render: (row) => {
        const len = (row.meta_title || row.title || "").length;
        return (
          <div className="flex items-center gap-2">
            <span className="truncate">{row.meta_title || row.title}</span>
            <Badge tone={len > 60 ? "amber" : "brand"}>{len}/60</Badge>
          </div>
        );
      },
    },
    {
      key: "meta_description",
      header: "Meta Description",
      render: (row) => {
        const len = (row.meta_description || row.excerpt || "").length;
        return (
          <div className="flex items-center gap-2">
            <span className="line-clamp-1 max-w-xs">{row.meta_description || row.excerpt || "—"}</span>
            <Badge tone={len > 160 || len === 0 ? "amber" : "brand"}>{len}/160</Badge>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader title="SEO" description="Cek kelengkapan meta title & description setiap artikel published." />
      {!isLoading && <DataTable columns={columns} rows={articles} emptyLabel="Belum ada artikel published." />}
    </>
  );
}
