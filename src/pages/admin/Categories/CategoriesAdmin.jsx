import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader.jsx";
import DataTable from "@/components/admin/DataTable.jsx";
import { Input, Textarea } from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";
import { useAsync } from "@/hooks/useAsync.js";
import { listCategories, createCategory, deleteCategory } from "@/services/categories.js";
import { slugify } from "@/utils/content.js";

export default function CategoriesAdmin() {
  const { data: categories, isLoading, refetch } = useAsync(() => listCategories(), []);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await createCategory({ name: form.name, slug: slugify(form.name), description: form.description });
      setForm({ name: "", description: "" });
      refetch();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus kategori ini?")) return;
    await deleteCategory(id);
    refetch();
  }

  const columns = [
    { key: "name", header: "Nama", render: (row) => <span className="font-medium">{row.name}</span> },
    { key: "slug", header: "Slug", render: (row) => <span className="font-mono text-xs text-muted">/{row.slug}</span> },
    { key: "description", header: "Deskripsi" },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <button onClick={() => handleDelete(row.id)} className="text-ink/60 hover:text-red-600" aria-label="Hapus">
          <Trash2 size={15} />
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Kategori" description="Kelola kategori artikel." />

      <form onSubmit={handleAdd} className="mb-6 flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input label="Nama Kategori" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jualan Online" />
        </div>
        <div className="flex-1">
          <Textarea label="Deskripsi (opsional)" rows={1} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <Button type="submit" disabled={saving} className="shrink-0">
          <Plus size={15} /> Tambah
        </Button>
      </form>

      {!isLoading && <DataTable columns={columns} rows={categories} emptyLabel="Belum ada kategori." />}
    </>
  );
}
