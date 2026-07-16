import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader.jsx";
import DataTable from "@/components/admin/DataTable.jsx";
import { useAsync } from "@/hooks/useAsync.js";
import { listAllArticles, deleteArticle } from "@/services/articles.js";
import { formatDate } from "@/utils/content.js";

export default function DraftsList() {
  const { data: drafts, isLoading, refetch } = useAsync(() => listAllArticles({ status: "draft" }), []);
  const navigate = useNavigate();

  async function handleDelete(id) {
    if (!confirm("Hapus draft ini?")) return;
    await deleteArticle(id);
    refetch();
  }

  const columns = [
    { key: "title", header: "Judul", render: (row) => <span className="font-medium">{row.title}</span> },
    { key: "category", header: "Kategori", render: (row) => row.category?.name || "—" },
    { key: "updated_at", header: "Terakhir diubah", render: (row) => formatDate(row.updated_at) },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/admin/artikel/${row.id}`)} className="text-ink/60 hover:text-brand" aria-label="Edit">
            <Pencil size={15} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="text-ink/60 hover:text-red-600" aria-label="Hapus">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Draft"
        description="Artikel yang belum dipublish."
        action={
          <Link to="/admin/artikel/baru" className="btn-primary">
            Tambah Artikel
          </Link>
        }
      />
      {!isLoading && <DataTable columns={columns} rows={drafts} emptyLabel="Tidak ada draft." />}
    </>
  );
}
